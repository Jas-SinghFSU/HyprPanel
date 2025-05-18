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
