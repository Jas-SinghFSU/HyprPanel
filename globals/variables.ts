import { Opt } from 'lib/option';
import { HexColor, MatugenTheme, RecursiveOptionsObject } from 'lib/types/options';

export const isOpt = <T>(value: unknown): value is Opt<T> =>
    typeof value === 'object' && value !== null && 'value' in value && value instanceof Opt;

export const isOptString = (value: unknown): value is Opt<string> => {
    return value instanceof Opt && typeof value.value === 'string';
};

export const isOptNumber = (value: unknown): value is Opt<number> => {
    return value instanceof Opt && typeof value.value === 'number';
};

export const isOptBoolean = (value: unknown): value is Opt<boolean> => {
    return value instanceof Opt && typeof value.value === 'boolean';
};

export const isOptMatugenTheme = (value: unknown): value is Opt<MatugenTheme> => {
    return value instanceof Opt && typeof value.value === 'object' && 'specificProperty' in value.value; // Replace 'specificProperty' with an actual property of MatugenTheme
};

export const isRecursiveOptionsObject = (value: unknown): value is RecursiveOptionsObject => {
    return typeof value === 'object' && value !== null && !(value instanceof Opt);
};

export const isHexColor = (val: unknown): val is HexColor => {
    return typeof val === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val);
};
