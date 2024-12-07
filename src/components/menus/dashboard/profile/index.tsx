import { Gtk } from 'astal/gtk3';
import { UserProfile } from './Profile';
import { PowerMenu } from './PowerMenu';

const Profile = (): JSX.Element => {
    return (
        <box className={'profiles-container'} halign={Gtk.Align.FILL} hexpand>
            <UserProfile />
            <PowerMenu />
        </box>
    );
};

export { Profile };
