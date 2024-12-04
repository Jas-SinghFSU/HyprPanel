import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { notifHasImg } from '../../menus/notifications/utils.js';
import { Gtk } from 'astal/gtk3';

export const Image = ({ notification }: ImageProps): JSX.Element => {
    if (!notifHasImg(notification)) {
        return <box />;
    }

    return (
        <box
            className={'notification-card-image-container'}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            vexpand={false}
        >
            <box
                className={'notification-card-image'}
                halign={Gtk.Align.CENTER}
                vexpand={false}
                css={`
                    background-image: url('${notification.image}');
                `}
            />
        </box>
    );
};

interface ImageProps {
    notification: AstalNotifd.Notification;
}
