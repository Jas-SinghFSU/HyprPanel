import { Process, Variable } from 'astal';

export interface GpuServiceCtor {
    frequency?: Variable<number>;
}

export type GPUStat = {
    index: number;
    uuid: string;
    name: string;
    'temperature.gpu': number;
    'fan.speed': number;
    'utilization.gpu': number;
    'utilization.enc': number;
    'utilization.dec': number;
    'power.draw': number;
    'enforced.power.limit': number;
    'memory.used': number;
    'memory.total': number;
    processes: Process[];
};
