import { execAsync } from 'astal/process';
import { NotificationArgs } from '../../lib/types/notification.types';

/**
 * Sends a notification using the notify-send command
 * This is a wrapper since AstalNotifd doesn't provide a send method
 * @param notifPayload - The notification arguments
 */
export function sendNotification(notifPayload: NotificationArgs): void {
    let command = 'notify-send';
    command += ` "${notifPayload.summary}"`;
    if (notifPayload.body !== undefined) command += ` "${notifPayload.body}"`;
    if (notifPayload.appName !== undefined) command += ` -a "${notifPayload.appName}"`;
    if (notifPayload.iconName !== undefined) command += ` -i "${notifPayload.iconName}"`;
    if (notifPayload.urgency !== undefined) command += ` -u "${notifPayload.urgency}"`;
    if (notifPayload.timeout !== undefined) command += ` -t ${notifPayload.timeout}`;
    if (notifPayload.category !== undefined) command += ` -c "${notifPayload.category}"`;
    if (notifPayload.transient !== undefined) command += ' -e';
    if (notifPayload.id !== undefined) command += ` -r ${notifPayload.id}`;

    execAsync(command)
        .then()
        .catch((err) => {
            console.error(`Failed to send notification: ${err.message}`);
        });
}

export { sendNotification as Notify };
