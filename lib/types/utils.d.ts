import { substitutes } from 'lib/icons';
import { EventArgs } from './widget';
import { Variable } from 'types/variable';

type SubstituteKeys = keyof typeof substitutes;

export type ThrottleFn = (
    cmd: string,
    args: EventArgs,
    fn?: (output: string) => void,
    postInputUpdated?: Variable<boolean>,
) => void;
export type ThrottleFnCallback = ((output: string) => void) | undefined;
