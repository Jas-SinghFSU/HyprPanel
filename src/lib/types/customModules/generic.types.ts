export type GenericFunction<Value, Parameters extends unknown[]> = (
    ...args: Parameters
) => Promise<Value> | Value;

type GenericResourceMetrics = {
    total: number;
    used: number;
    percentage: number;
};

export type GenericResourceData = GenericResourceMetrics & {
    free: number;
};

export enum Postfix {
    Tebibyte = 'TiB',
    Gibibyte = 'GiB',
    Mebibyte = 'MiB',
    Kibibyte = 'KiB',
    Byte = 'B',
}

export type UpdateHandlers = {
    disconnectPrimary: () => void;
    disconnectSecondary: () => void;
    disconnectMiddle: () => void;
    disconnectScroll: () => void;
};
