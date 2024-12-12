import { batteryService } from '../constants/services';
import icons from '../icons/icons';
import { Notify } from '../utils';

export function warnOnLowBattery(): void {
    batteryService.connect('notify::percent', () => {
        const { lowBatteryThreshold, lowBatteryNotification, lowBatteryNotificationText, lowBatteryNotificationTitle } =
            options.menus.power;

        if (!lowBatteryNotification.get() || batteryService.charging) {
            return;
        }

        const lowThreshold = lowBatteryThreshold.get();

        if (batteryService.percentage === lowThreshold || batteryService.percentage === lowThreshold / 2) {
            Notify({
                summary: lowBatteryNotificationTitle
                    .get()
                    .replace('/$POWER_LEVEL/g', batteryService.percentage.toString()),
                body: lowBatteryNotificationText.get().replace('/$POWER_LEVEL/g', batteryService.percentage.toString()),
                iconName: icons.ui.warning,
                urgency: 'critical',
                timeout: 7000,
            });
        }
    });
}
