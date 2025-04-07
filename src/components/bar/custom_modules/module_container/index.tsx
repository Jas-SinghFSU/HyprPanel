import { BarBoxChild } from 'src/lib/types/bar.js';
import { CustomBarModule } from '../types';
import { Module } from '../../shared/Module';
import { Astal } from 'astal/gtk3';
import { inputHandler } from '../../utils/helpers';
import { bind, Variable } from 'astal';
import { BashPoller } from 'src/lib/poller/BashPoller';
import { getIcon } from './helpers/icon';
import { getLabel } from './helpers/label';

export const ModuleContainer = (moduleName: string, moduleMetadata: CustomBarModule): BarBoxChild => {
    const pollingInterval = Variable(moduleMetadata.interval ?? 0);
    const commandOutput = Variable('');

    const commandPoller = new BashPoller<string, []>(
        commandOutput,
        [],
        bind(pollingInterval),
        moduleMetadata.execute || '',
        (commandResult: string) => commandResult,
    );

    if (moduleMetadata.interval !== undefined && moduleMetadata.interval >= 0) {
        commandPoller.initialize();
    }

    const module = Module({
        textIcon: bind(commandOutput).as((cmdOutput) => getIcon(moduleName, cmdOutput, moduleMetadata)),
        tooltipText: bind(commandOutput).as((cmdOutput) =>
            getLabel(moduleName, cmdOutput, moduleMetadata.tooltip ?? ''),
        ),
        boxClass: `user-module-${moduleName}`,
        label: bind(commandOutput).as((cmdOutput) => getLabel(moduleName, cmdOutput, moduleMetadata.label ?? '')),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: Variable(moduleMetadata.actions?.onLeftClick ?? ''),
                    },
                    onSecondaryClick: {
                        cmd: Variable(moduleMetadata.actions?.onRightClick ?? ''),
                    },
                    onMiddleClick: {
                        cmd: Variable(moduleMetadata.actions?.onMiddleClick ?? ''),
                    },
                    onScrollUp: {
                        cmd: Variable(moduleMetadata.actions?.onScrollUp ?? ''),
                    },
                    onScrollDown: {
                        cmd: Variable(moduleMetadata.actions?.onScrollDown ?? ''),
                    },
                });
            },
            onDestroy: () => {},
        },
        isVis: bind(commandOutput).as((cmdOutput) => {
            if (!moduleMetadata.hideOnEmpty) {
                return true;
            }

            return cmdOutput.length === 0;
        }),
    });

    return module;
};
