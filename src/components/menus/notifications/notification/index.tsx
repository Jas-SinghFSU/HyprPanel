import options from 'src/options.js';
import { filterNotifications } from 'src/lib/shared/notifications.js';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import Variable from 'astal/variable.js';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal/binding.js';
import { notifdService } from 'src/lib/constants/services.js';
import { NotificationCard } from 'src/components/notifications/Notification.js';
import { Placeholder } from './Placeholder';

const { displayedTotal, ignore, showActionsOnHover } = options.notifications;

export const NotificationsContainer = ({ curPage }: NotificationsContainerProps): JSX.Element => {
    return (
        <scrollable vscroll={Gtk.PolicyType.AUTOMATIC}>
            <box className={'menu-content-container notifications'} halign={Gtk.Align.FILL} spacing={0} vexpand>
                {Variable.derive(
                    [
                        bind(notifdService, 'notifications'),
                        bind(curPage),
                        bind(displayedTotal),
                        bind(ignore),
                        bind(showActionsOnHover),
                    ],
                    (notifications, currentPage, totalDisplayed, ignored, hoverActions) => {
                        const filteredNotifications = filterNotifications(notifications, ignored).sort(
                            (a, b) => b.time - a.time,
                        );

                        if (filteredNotifications.length <= 0) {
                            return <Placeholder />;
                        }

                        const pageStart = (currentPage - 1) * totalDisplayed;
                        const pageEnd = currentPage * totalDisplayed;

                        return (
                            <box
                                className={'notification-card-content-container'}
                                valign={Gtk.Align.START}
                                vexpand={false}
                                vertical
                            >
                                {filteredNotifications
                                    .slice(pageStart, pageEnd)
                                    .map((notification: AstalNotifd.Notification) => {
                                        return (
                                            <NotificationCard
                                                className={'notification-card menu'}
                                                notification={notification}
                                                showActions={hoverActions}
                                            />
                                        );
                                    })}
                            </box>
                        );
                    },
                )()}
            </box>
        </scrollable>
    );
};

interface NotificationsContainerProps {
    curPage: Variable<number>;
}
