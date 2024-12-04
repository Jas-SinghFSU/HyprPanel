import { notifdService } from 'src/lib/constants/services.js';
import { hyprlandService } from 'src/lib/constants/services.js';
import options from 'src/options.js';
import { getPosition } from 'src/lib/utils.js';
import { filterNotifications } from 'src/lib/shared/notifications.js';
import Variable from 'astal/variable.js';
import { bind } from 'astal/binding.js';
import { GtkWidget } from 'src/lib/types/widget.js';
import { trackActiveMonitor } from './helpers.js';
import { Astal } from 'astal/gtk3';
import { NotificationCard } from './Notification.js';

const { position, monitor, active_monitor, ignore, showActionsOnHover, displayedTotal } = options.notifications;
const { tear } = options;

const curMonitor = Variable(monitor.value);

trackActiveMonitor(curMonitor);

export default (): GtkWidget => {
    return (
        <window
            name={'notifications-window'}
            className={'notifications-window'}
            layer={bind(tear).as((tear) => (tear ? Astal.Layer.TOP : Astal.Layer.OVERLAY))}
            anchor={bind(position).as(getPosition)}
            exclusivity={Astal.Exclusivity.NORMAL}
            monitor={Variable.derive(
                [bind(hyprlandService, 'focusedMonitor'), bind(monitor), bind(active_monitor)],
                (focusedMonitor, monitor, activeMonitor) => {
                    if (activeMonitor === true) {
                        return focusedMonitor.id;
                    }
                    return monitor;
                },
            )()}
        >
            <box vertical hexpand className={'notification-card-container'}>
                {Variable.derive(
                    [bind(notifdService, 'notifications'), bind(ignore), bind(showActionsOnHover)],
                    (notifications, ignore, showActions) => {
                        const filteredNotifications = filterNotifications(notifications, ignore);
                        const maxDisplayed = filteredNotifications.slice(0, displayedTotal.get());

                        return maxDisplayed.map((notification) => {
                            return <NotificationCard notification={notification} showActions={showActions} />;
                        });
                    },
                )()}
            </box>
        </window>
    );
};
