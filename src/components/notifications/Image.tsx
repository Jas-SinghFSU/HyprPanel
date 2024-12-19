import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { Gtk } from 'astal/gtk3';
import { notifHasImg } from './helpers';
import { isAnImage } from 'src/lib/utils';

const ImageItem = ({ notification }: ImageProps): JSX.Element => {
    if (notification.appIcon && !isAnImage(notification.appIcon)) {
        return (
            <icon
                className={'notification-card-image icon'}
                halign={Gtk.Align.CENTER}
                vexpand={false}
                icon={notification.appIcon}
            />
        );
    }

    return (
        <box
            className={'notification-card-image'}
            halign={Gtk.Align.CENTER}
            vexpand={false}
            css={`
                background-image: url('${notification.image || notification.appIcon}');
            `}
        />
    );
};
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
            <ImageItem notification={notification} />
        </box>
    );
};

interface ImageProps {
    notification: AstalNotifd.Notification;
}
