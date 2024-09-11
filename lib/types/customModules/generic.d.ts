export type GenericFunction<T, P extends unknown[] = unknown[]> = (...args: P) => T;

export type GenericResourceData = {
    total: number;
    used: number;
    free: number;
    percentage: number;
};

export type Postfix = 'TiB' | 'GiB' | 'MiB' | 'KiB' | 'B';
