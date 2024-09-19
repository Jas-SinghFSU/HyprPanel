import { Opt } from 'lib/option';
import { HexColor, RecursiveOptionsObject } from 'lib/types/options';

export const isOpt = <T>(value: unknown): value is Opt<T> =>
    typeof value === 'object' && value !== null && 'value' in value && value instanceof Opt;

export const isRecursiveOptionsObject = (value: unknown): value is RecursiveOptionsObject => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isHexColor = (value: string): value is HexColor => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
};
