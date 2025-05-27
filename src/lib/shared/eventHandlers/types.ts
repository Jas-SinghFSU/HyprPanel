import { Variable } from 'astal';
import { EventArgs } from 'src/components/bar/utils/input/types';

export type ThrottleFn = (
    cmd: string,
    args: EventArgs,
    fn?: (output: string) => void,
    postInputUpdated?: Variable<boolean>,
) => void;
