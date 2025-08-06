import AstalBattery from 'gi://AstalBattery?version=0.1';
import icons from 'src/lib/icons/icons';
import options from 'src/configuration';
import { SystemUtilities } from '../system/SystemUtilities';

const batteryService = AstalBattery.get_default();
const {
    lowBatteryThreshold,
    lowBatteryNotification,
    lowBatteryNotificationText,
    lowBatteryNotificationTitle,
} = options.menus.power;

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
            SystemUtilities.notify({
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
