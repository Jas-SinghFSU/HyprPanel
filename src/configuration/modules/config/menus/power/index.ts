import { opt } from 'src/lib/options';

export default {
    lowBatteryNotification: opt(false),
    lowBatteryThreshold: opt(20),
    lowBatteryNotificationTitle: opt('Warning: Low battery'),
    lowBatteryNotificationText: opt(
        'Your battery is running low ($POWER_LEVEL %).\n\nPlease plug in your charger.',
    ),
    showLabel: opt(true),
    confirmation: opt(true),
    sleep: opt('systemctl suspend'),
    reboot: opt('systemctl reboot'),
    logout: opt('hyprctl dispatch exit'),
    shutdown: opt('systemctl poweroff'),
};
