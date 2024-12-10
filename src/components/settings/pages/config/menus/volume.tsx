import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const VolumeMenuSettings = (): JSX.Element => {
    return (
        <scrollable name={'Volume'} vscroll={Gtk.PolicyType.AUTOMATIC}>
            <box className="bar-theme-page paged-container" vertical>
                <Header title="Volume" />
                <Option
                    opt={options.menus.volume.raiseMaximumVolume}
                    title="Allow Raising Volume Above 100%"
                    subtitle="Allows up to 150% volume"
                    type="boolean"
                />
            </box>
        </scrollable>
    );
};
