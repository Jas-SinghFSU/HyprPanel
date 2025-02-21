
import AstalBattery from 'gi://AstalBattery?version=0.1';
import icons from '../icons/icons';
import { Notify } from '../utils';

const batteryService = AstalBattery.get_default();

export function warnOnLowBattery(): void {
    let sentLowNotification = false;
    let sentHalfLowNotification = false;

    // Charging state notifications
    batteryService.connect('notify::charging', () => {
        if (batteryService.charging) {
            // Charger plugged in
            Notify({
                summary: "Charger Plugged In",
                body: "Your device is now charging.",
                iconName: icons.battery.charging,
                urgency: 'normal',
            });
        } else {
            // Charger unplugged
            Notify({
                summary: "Charger Unplugged",
                body: "Your device is no longer charging.",
                iconName: icons.battery.warning,
                urgency: 'normal',
            });
        }
    });

    // Battery percentage notifications
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
