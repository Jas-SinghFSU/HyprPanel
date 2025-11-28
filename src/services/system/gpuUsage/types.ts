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

export type AMDGpuStat = {
    DeviceName: string;
    PCI: string;
    gpu_activity: {
        GFX: {
            unit: string;
            value: number;
        };
        MediaEngine?: {
            unit: string;
            value: number;
        };
        Memory?: {
            unit: string;
            value: number | null;
        };
    };
};

export type GpuVendor = 'nvidia' | 'amd' | 'unknown';
