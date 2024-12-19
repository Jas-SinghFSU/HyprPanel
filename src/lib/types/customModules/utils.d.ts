import { Binding } from 'src/lib/utils';
import { Variable } from 'types/variable';

export type InputHandlerEvents = {
    onPrimaryClick?: Binding;
    onSecondaryClick?: Binding;
    onMiddleClick?: Binding;
    onScrollUp?: Binding;
    onScrollDown?: Binding;
};

export type RunAsyncCommand = (
    cmd: string,
    args: EventArgs,
    fn?: (output: string) => void,
    postInputUpdater?: Variable<boolean>,
) => void;
