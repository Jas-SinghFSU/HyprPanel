import { Variable } from 'astal';

export interface CpuTempServiceCtor {
    sensor?: Variable<string>;
    frequency?: Variable<number>;
}
