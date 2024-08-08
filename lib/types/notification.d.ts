export interface NotificationArgs {
    appName?: string;
    body?: string;
    iconName?: string;
    id?: number;
    summary?: string;
    urgency?: Urgency;
    category?: string;
    timeout?: number;
    transient?: boolean;
}
