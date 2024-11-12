import { GtkWidget } from 'lib/types/widget';
import { passwordInput } from './input/index';
import { profileName } from './profile/name';
import { profilePicture } from './profile/picture';
import { sessionSelector } from './sessions/index';

export const auth = (): GtkWidget => {
    return Widget.Box({
        class_name: 'auth',
        hpack: 'center',
        vpack: 'center',
        vertical: true,
        children: [
            Widget.Box({
                vertical: true,
                expand: true,
                hpack: 'center',
                vpack: 'center',
                children: [profilePicture(), profileName(), passwordInput(), sessionSelector()],
            }),
        ],
    });
};
