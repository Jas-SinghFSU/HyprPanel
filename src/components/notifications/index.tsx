import { hyprlandService } from 'src/lib/constants/services.js';
import options from 'src/options.js';
import { getPosition } from 'src/lib/utils.js';
import Variable from 'astal/variable.js';
import { bind } from 'astal/binding.js';
import { trackActiveMonitor, trackPopupNotifications } from './helpers.js';
import { Astal } from 'astal/gtk3';
import { NotificationCard } from './Notification.js';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';

const { position, monitor, active_monitor, showActionsOnHover, displayedTotal } = options.notifications;
const { tear } = options;

const curMonitor = Variable(monitor.get());
const popupNotifications: Variable<AstalNotifd.Notification[]> = Variable([]);

trackActiveMonitor(curMonitor);
trackPopupNotifications(popupNotifications);

export default (): JSX.Element => {
    const windowLayer = bind(tear).as((tear) => (tear ? Astal.Layer.TOP : Astal.Layer.OVERLAY));
    const windowAnchor = bind(position).as(getPosition);
    const windowMonitor = Variable.derive(
        [bind(hyprlandService, 'focusedMonitor'), bind(monitor), bind(active_monitor)],
        (focusedMonitor, monitor, activeMonitor) => {
            if (activeMonitor === true) {
                return focusedMonitor.id;
            }
            return monitor;
        },
    );

    const notificationsBinding = Variable.derive(
        [bind(popupNotifications), bind(showActionsOnHover)],
        (notifications, showActions) => {
            const maxDisplayed = notifications.slice(0, displayedTotal.get());

            return maxDisplayed.map((notification) => {
                return <NotificationCard notification={notification} showActions={showActions} />;
            });
        },
    );

    return (
        <window
            name={'notifications-window'}
            namespace={'notifications-window'}
            className={'notifications-window'}
            layer={windowLayer}
            anchor={windowAnchor}
            exclusivity={Astal.Exclusivity.NORMAL}
            monitor={windowMonitor()}
            onDestroy={() => {
                windowMonitor.drop();
                notificationsBinding.drop();
            }}
        >
            <box vertical hexpand className={'notification-card-container'}>
                {notificationsBinding()}
            </box>
        </window>
    );
};
