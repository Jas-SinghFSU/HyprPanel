export interface HardwarePollerInterface {
    updateTimer(timerInMs: number): void;
    stopPoller(): void;
    startPoller(): void;
}

export interface ResourceUsageData {
    total: number;
    used: number;
    percentage: number;
    free: number;
}

export interface HardwareServiceConfig {
    updateFrequency?: number;
    shouldRound?: boolean;
}

type GenericResourceMetrics = {
    total: number;
    used: number;
    percentage: number;
};

export type GenericResourceData = GenericResourceMetrics & {
    free: number;
};

export type NetworkResourceData = {
    in: string;
    out: string;
};

export type ResourceLabelType = 'used/total' | 'used' | 'percentage' | 'free';

export type NetstatLabelType = 'full' | 'in' | 'out';

export type RateUnit = 'GiB' | 'MiB' | 'KiB' | 'auto';

export enum ByteMultiplier {
    BYTE = 1,
    KIBIBYTE = 1024,
    MEBIBYTE = 1024 * 1024,
    GIBIBYTE = 1024 * 1024 * 1024,
}

export const LABEL_TYPES: ResourceLabelType[] = ['used/total', 'used', 'free', 'percentage'] as const;
