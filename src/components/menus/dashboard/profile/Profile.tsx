import { bind, exec } from 'astal';
import { Gtk } from 'astal/gtk3';
import options from 'src/options.js';
import { normalizePath, isAnImage } from 'src/lib/utils.js';

const { image, name } = options.menus.dashboard.powermenu.avatar;

const ProfilePicture = (): JSX.Element => {
    return (
        <box
            className={'profile-picture'}
            halign={Gtk.Align.CENTER}
            css={bind(image).as((img) => {
                if (isAnImage(img)) {
                    return `background-image: url("${normalizePath(img)}")`;
                }

                return `background-image: url("${SRC_DIR}/assets/hyprpanel.png")`;
            })}
        />
    );
};

const ProfileName = (): JSX.Element => {
    return (
        <label
            className={'profile-name'}
            halign={Gtk.Align.CENTER}
            label={bind(name).as((profileName) => {
                if (profileName === 'system') {
                    return exec('bash -c whoami');
                }
                return profileName;
            })}
        />
    );
};

export const UserProfile = (): JSX.Element => {
    return (
        <box className={'profile-picture-container dashboard-card'} hexpand vertical>
            <ProfilePicture />
            <ProfileName />
        </box>
    );
};
