export type GPU_Stat_Process = {
    username: string;
    command: string;
    full_command: string[];
    gpu_memory_usage: number;
    cpu_percent: number;
    cpu_memory_usage: number;
    pid: number;
};

export type GPU_Stat = {
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
