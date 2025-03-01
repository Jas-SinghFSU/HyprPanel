import { Variable } from 'astal';
import { Opt } from 'src/lib/option';
import { Binding } from 'src/lib/utils';

export type InputHandlerEventArgs = {
    cmd?: Opt<string> | Variable<string>;
    fn?: (output: string) => void;
};
export type InputHandlerEvents = {
    onPrimaryClick?: InputHandlerEventArgs;
    onSecondaryClick?: InputHandlerEventArgs;
    onMiddleClick?: InputHandlerEventArgs;
    onScrollUp?: InputHandlerEventArgs;
    onScrollDown?: InputHandlerEventArgs;
};

export type RunAsyncCommand = (
    cmd: string,
    args: EventArgs,
    fn?: (output: string) => void,
    postInputUpdater?: Variable<boolean>,
) => void;
