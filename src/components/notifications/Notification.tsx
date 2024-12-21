import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { Actions } from './Actions';
import { Body } from './Body';
import { CloseButton } from './CloseButton';
import { Header } from './Header';
import { Image } from './Image';
import { Gtk, Widget } from 'astal/gtk3';
import { isSecondaryClick } from 'src/lib/utils';
import { notifHasImg } from './helpers';

const NotificationContent = ({ actionBox, notification }: NotificationContentProps): JSX.Element => {
    return (
        <box className={`notification-card-content ${!notifHasImg(notification) ? 'noimg' : ''}`} hexpand vertical>
            <Header notification={notification} />
            <Body notification={notification} />
            {actionBox}
        </box>
    );
};

export const NotificationCard = ({ notification, showActions, ...props }: NotificationCardProps): JSX.Element => {
    const actionBox: IActionBox | null = notification.get_actions().length ? (
        <Actions notification={notification} showActions={showActions} />
    ) : null;

    return (
        <eventbox
            onClick={(_, event) => {
                if (isSecondaryClick(event)) {
                    notification.dismiss();
                }
            }}
            onHover={() => {
                if (actionBox !== null && showActions === true) {
                    actionBox.revealChild = true;
                }
            }}
            onHoverLost={() => {
                if (actionBox !== null && showActions === true) {
                    actionBox.revealChild = false;
                }
            }}
        >
            <box className={'notification-card'} {...props} hexpand valign={Gtk.Align.START}>
                <Image notification={notification} />
                <NotificationContent notification={notification} actionBox={actionBox} />
                <CloseButton notification={notification} />
            </box>
        </eventbox>
    );
};

interface NotificationCardProps extends Widget.BoxProps {
    notification: AstalNotifd.Notification;
    showActions: boolean;
}

interface IActionBox extends Gtk.Widget {
    revealChild?: boolean;
}

interface NotificationContentProps {
    actionBox: IActionBox | null;
    notification: AstalNotifd.Notification;
}
