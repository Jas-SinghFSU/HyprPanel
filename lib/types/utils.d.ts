import { substitutes } from 'lib/icons';
import { EventArgs } from './widget';

type SubstituteKeys = keyof typeof substitutes;

export type ThrottleFn = (cmd: string, args: EventArgs, fn?: (output: string) => void) => void;
export type ThrottleFnCallback = ((output: string) => void) | undefined;
