import { bind } from 'astal';
import { clearNotifications } from 'src/globals/notification';
import { notifdService } from 'src/lib/constants/services';
import { isPrimaryClick } from 'src/lib/utils';
import options from 'src/options';

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
