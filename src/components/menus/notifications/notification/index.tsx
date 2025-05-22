import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';
import { Placeholder } from './Placeholder';
import { NotificationCard } from 'src/components/notifications/Notification';
import options from 'src/configuration';
import { filterNotifications } from 'src/lib/shared/notifications';

const notifdService = AstalNotifd.get_default();

const { displayedTotal, ignore, showActionsOnHover } = options.notifications;

export const NotificationsContainer = ({ curPage }: NotificationsContainerProps): JSX.Element => {
    return (
        <scrollable vscroll={Gtk.PolicyType.AUTOMATIC}>
            <box
                className={'menu-content-container notifications'}
                halign={Gtk.Align.FILL}
                spacing={0}
                vexpand
            >
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
