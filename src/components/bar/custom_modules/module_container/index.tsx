import { BarBoxChild } from 'src/lib/types/bar.js';
import { CustomBarModule } from '../types';
import { Module } from '../../shared/Module';
import { Astal } from 'astal/gtk3';
import { inputHandler } from '../../utils/helpers';
import { bind, Variable } from 'astal';
import { BashPoller } from 'src/lib/poller/BashPoller';

export const ModuleContainer = (moduleName: string, moduleMetadata: CustomBarModule): BarBoxChild => {
    const pollingInterval = Variable(moduleMetadata.interval ?? 0);
    console.log(`Polling Interval: ${pollingInterval.get()}`);
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

    Variable.derive([bind(commandOutput)], (cmdOutput) => {
        console.log(`commandOutput: ${cmdOutput}`);
    });

    const module = Module({
        textIcon: moduleMetadata.icon,
        tooltipText: moduleMetadata.tooltip,
        boxClass: `user-module-${moduleName}`,
        label: moduleMetadata.label,
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
    });

    return module;
};
