export type CommandResult = {
    exitCode: number;
    stdout: string;
    stderr: string;
};

export type ServiceStatus = 'ACTIVE' | 'INSTALLED' | 'DISABLED' | 'MISSING';

export interface NotificationArgs {
    appName?: string;
    body?: string;
    iconName?: string;
    id?: number;
    summary?: string;
    urgency?: string;
    category?: string;
    timeout?: number;
    transient?: boolean;
}
