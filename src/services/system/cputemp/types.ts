import { Variable } from 'astal';

export interface CpuTempServiceCtor {
    sensor?: Variable<string>;
    frequency?: Variable<number>;
}

export interface SensorInfo {
    path: string;
    name: string;
    type: 'hwmon' | 'thermal';
}
