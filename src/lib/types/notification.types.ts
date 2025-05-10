import icons from 'src/lib/icons/icons2';

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

export type NotificationIcon = keyof typeof icons.notifications;
