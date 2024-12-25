import { batteryService } from '../constants/services';
import icons from '../icons/icons';
import { Notify } from '../utils';

export function warnOnLowBattery(): void {
    let sentLowNotification = false;
    let sentHalfLowNotification = false;

    batteryService.connect('notify::charging', () => {
        // Reset it when the battery is put to charge
        if (batteryService.charging) {
            sentLowNotification = false;
            sentHalfLowNotification = false;
        }
    });

    batteryService.connect('notify::percentage', () => {
        const { lowBatteryThreshold, lowBatteryNotification, lowBatteryNotificationText, lowBatteryNotificationTitle } =
            options.menus.power;

        if (!lowBatteryNotification.get() || batteryService.charging) {
            return;
        }

        // batteryService.percentage will be a double in between 0 and 1, so we multiply it by 100 to convert it to the percentage
        const batteryPercentage = Math.floor(batteryService.percentage * 100);
        const lowThreshold = lowBatteryThreshold.get();

        // To avoid double notifications, we check each of the thresholds and set the correct `sentNotification`, but then
        // combine them into one notification only
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
                summary: lowBatteryNotificationTitle.get().replaceAll('$POWER_LEVEL', batteryPercentage.toString()),
                body: lowBatteryNotificationText.get().replaceAll('$POWER_LEVEL', batteryPercentage.toString()),
                iconName: icons.ui.warning,
                urgency: 'critical',
            });
        }
    });
}
