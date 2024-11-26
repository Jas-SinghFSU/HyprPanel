import { EventArgs } from './eventArgs';
import { Variable } from 'types/variable';

export type ThrottleFn = (
    cmd: string,
    args: EventArgs,
    fn?: (output: string) => void,
    postInputUpdated?: Variable<boolean>,
) => void;

export type ThrottleFnCallback = ((output: string) => void) | undefined;
