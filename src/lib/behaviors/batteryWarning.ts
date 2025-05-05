import AstalBattery from 'gi://AstalBattery?version=0.1';
import icons from '../icons/icons';
import { Notify } from '../utils';

const batteryService = AstalBattery.get_default();

export function warnOnLowBattery(): void {
    let sentLowNotification = false;
    let sentHalfLowNotification = false;

    batteryService.connect('notify::charging', () => {
        if (batteryService.charging) {
            sentLowNotification = false;
            sentHalfLowNotification = false;
        }
    });

    batteryService.connect('notify::percentage', () => {
        const {
            lowBatteryThreshold,
            lowBatteryNotification,
            lowBatteryNotificationText,
            lowBatteryNotificationTitle,
        } = options.menus.power;

        if (lowBatteryNotification.get() === undefined || batteryService.charging) {
            return;
        }

        const batteryPercentage = Math.floor(batteryService.percentage * 100);
        const lowThreshold = lowBatteryThreshold.get();

        // Avoid double notification
        let sendNotification = false;

        if (!sentLowNotification && batteryPercentage <= lowThreshold) {
            sentLowNotification = true;
            sendNotification = true;
        }

        if (!sentHalfLowNotification && batteryPercentage <= lowThreshold / 2) {
            sentHalfLowNotification = true;
            sendNotification = true;
        }

        if (sendNotification) {
            Notify({
                summary: lowBatteryNotificationTitle
                    .get()
                    .replaceAll('$POWER_LEVEL', batteryPercentage.toString()),
                body: lowBatteryNotificationText
                    .get()
                    .replaceAll('$POWER_LEVEL', batteryPercentage.toString()),
                iconName: icons.ui.warning,
                urgency: 'critical',
            });
        }
    });
}
