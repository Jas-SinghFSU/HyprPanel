export type GenericFunction<T, P extends unknown[] = unknown[]> = (...args: P) => T;

export type GenericResourceMetrics = {
    total: number;
    used: number;
    percentage: number;
};

type GenericResourceData = ResourceUsage & {
    free: number;
};

export type Postfix = 'TiB' | 'GiB' | 'MiB' | 'KiB' | 'B';
