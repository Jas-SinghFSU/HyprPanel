import { substitutes } from 'lib/icons';

type SubstituteKeys = keyof typeof substitutes;

export type ThrottleFn = (cmd: string, fn: ((output: string) => void) | undefined) => void;
export type ThrottleFnCallback = ((output: string) => void) | undefined;
