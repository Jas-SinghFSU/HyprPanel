import { HexColor } from 'src/lib/options/types';

export const isHexColor = (val: unknown): val is HexColor => {
    return typeof val === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val);
};
