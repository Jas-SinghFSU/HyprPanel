export type GenericResourceData = {
    total: number;
    used: number;
    free: number;
    percentage: number;
};

export type Postfix = 'TiB' | 'GiB' | 'MiB' | 'KiB' | 'B';
