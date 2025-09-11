import options from 'src/configuration';
import { bind, Variable } from 'astal';
import { trackActiveMonitor, trackAutoTimeout, trackPopupNotifications } from './helpers.js';
import { Astal } from 'astal/gtk3';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { GdkMonitorService } from 'src/services/display/monitor/index.js';
import { getPosition } from 'src/lib/window/positioning.js';
import { NotificationCard } from './Notification';
import { App } from 'astal/gtk3';

const hyprlandService = AstalHyprland.get_default();
const { position, monitor, active_monitor, showActionsOnHover, displayedTotal } = options.notifications;
const { tear } = options;

const curMonitor = Variable(monitor.get());
const popupNotifications: Variable<AstalNotifd.Notification[]> = Variable([]);

trackActiveMonitor(curMonitor);
trackPopupNotifications(popupNotifications);
trackAutoTimeout();

export default (): JSX.Element => {
    const gdkMonitorMapper = GdkMonitorService.getInstance();

    const windowLayer = bind(tear).as((tear) => (tear ? Astal.Layer.TOP : Astal.Layer.OVERLAY));
    const windowAnchor = bind(position).as(getPosition);
    const windowMonitor = Variable.derive(
        [bind(hyprlandService, 'focusedMonitor'), bind(monitor), bind(active_monitor)],
        (focusedMonitor, monitor, activeMonitor) => {
            if (activeMonitor === true && focusedMonitor) {
                const gdkMonitor = gdkMonitorMapper.mapHyprlandToGdk(focusedMonitor.id);
                return gdkMonitor;
            }

            const gdkMonitor = gdkMonitorMapper.mapHyprlandToGdk(monitor);
            return gdkMonitor;
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
            application={App}
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
