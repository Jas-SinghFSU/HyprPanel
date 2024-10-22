import { Binding } from 'lib/utils';

export type InputHandlerEvents = {
    onPrimaryClick?: Binding;
    onSecondaryClick?: Binding;
    onMiddleClick?: Binding;
    onScrollUp?: Binding;
    onScrollDown?: Binding;
};

export type RunAsyncCommand = (cmd: string, args: EventArgs, fn?: (output: string) => void) => void;
