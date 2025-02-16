import { bind } from 'astal';
import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { clearNotifications } from 'src/globals/notification';
import { isPrimaryClick } from 'src/lib/utils';
import options from 'src/options';

const notifdService = AstalNotifd.get_default();

const { clearDelay } = options.notifications;

export const ClearNotificationsButton = (): JSX.Element => {
    return (
        <button
            className={'clear-notifications-button'}
            tooltipText={'Clear Notifications'}
            onClick={(_, event) => {
                if (!isPrimaryClick(event)) {
                    return;
                }

                if (removingNotifications.get()) {
                    return;
                }

                clearNotifications(notifdService.get_notifications(), clearDelay.get());
            }}
        >
            <label
                className={bind(removingNotifications).as((removing) => {
                    return removing
                        ? 'clear-notifications-label txt-icon removing'
                        : 'clear-notifications-label txt-icon';
                })}
                label={''}
            />
        </button>
    );
};
