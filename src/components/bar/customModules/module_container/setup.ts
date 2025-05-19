import { Variable, bind, execAsync } from 'astal';
import { Astal } from 'astal/gtk3';
import { BashPoller } from 'src/lib/poller/BashPoller';
import { CustomBarModule } from '../types';
import { inputHandler } from '../../utils/helpers';

export function initCommandPoller(
    commandOutput: Variable<string>,
    pollingInterval: Variable<number>,
    moduleExecute: string,
    moduleInterval: number,
): BashPoller<string, []> {
    const commandPoller = new BashPoller<string, []>(
        commandOutput,
        [],
        bind(pollingInterval),
        moduleExecute || '',
        (commandResult: string) => commandResult,
    );

    if (moduleInterval >= 0) {
        commandPoller.initialize();
    }

    return commandPoller;
}

export function initActionListener(
    actionExecutionListener: Variable<boolean>,
    moduleExecuteOnAction: string,
    commandOutput: Variable<string>,
): void {
    actionExecutionListener.subscribe(() => {
        if (typeof moduleExecuteOnAction !== 'string' || !moduleExecuteOnAction.length) {
            return;
        }

        execAsync(moduleExecuteOnAction).then((cmdOutput) => {
            commandOutput.set(cmdOutput);
        });
    });
}

/**
 * Sets up user interaction handlers for the module
 */
export function setupModuleInteractions(
    element: Astal.Button,
    moduleActions: CustomBarModule['actions'],
    actionListener: Variable<boolean>,
    moduleScrollThreshold: number,
): void {
    const scrollThreshold = moduleScrollThreshold >= 0 ? moduleScrollThreshold : 1;
    inputHandler(
        element,
        {
            onPrimaryClick: {
                cmd: Variable(moduleActions?.onLeftClick ?? ''),
            },
            onSecondaryClick: {
                cmd: Variable(moduleActions?.onRightClick ?? ''),
            },
            onMiddleClick: {
                cmd: Variable(moduleActions?.onMiddleClick ?? ''),
            },
            onScrollUp: {
                cmd: Variable(moduleActions?.onScrollUp ?? ''),
            },
            onScrollDown: {
                cmd: Variable(moduleActions?.onScrollDown ?? ''),
            },
        },
        actionListener,
        scrollThreshold,
    );
}
