export type GenericFunction<Value, Parameters extends unknown[]> = (...args: Parameters) => Promise<Value> | Value;

export type GenericResourceMetrics = {
    total: number;
    used: number;
    percentage: number;
};

export type GenericResourceData = GenericResourceMetrics & {
    free: number;
};

export type Postfix = 'TiB' | 'GiB' | 'MiB' | 'KiB' | 'B';

export type UpdateHandlers = {
    disconnectPrimary: () => void;
    disconnectSecondary: () => void;
    disconnectMiddle: () => void;
    disconnectScroll: () => void;
};
