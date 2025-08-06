import { Variable } from 'astal';

export interface NetworkServiceCtor {
    frequency?: Variable<number>;
}

export interface NetworkUsage {
    name: string;
    rx: number;
    tx: number;
}
