import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { Gtk } from 'astal/gtk3';
import { notifHasImg } from './helpers';

export const Body = ({ notification }: BodyProps): JSX.Element => {
    return (
        <box className={'notification-card-body'} valign={Gtk.Align.START} hexpand>
            <label
                className={'notification-card-body-label'}
                halign={Gtk.Align.START}
                label={notification.body}
                maxWidthChars={!notifHasImg(notification) ? 35 : 28}
                lines={2}
                truncate
                wrap
                justify={Gtk.Justification.LEFT}
                hexpand
                useMarkup
                onRealize={(self) => self.set_markup(notification.body)}
            />
        </box>
    );
};

interface BodyProps {
    notification: AstalNotifd.Notification;
}
