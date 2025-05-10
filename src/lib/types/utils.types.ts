import { Variable } from 'astal';
import { EventArgs } from './widget.types';

export type ThrottleFn = (
    cmd: string,
    args: EventArgs,
    fn?: (output: string) => void,
    postInputUpdated?: Variable<boolean>,
) => void;

export type ThrottleFnCallback = ((output: string) => void) | undefined;

export type Primitive = string | number | boolean | symbol | null | undefined | bigint;
