import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const OsdTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'OSD'}
            className="osd-theme-page paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* On Screen Display Settings Section */}
                <Header title="On Screen Display Settings" />
                <Option
                    opt={options.theme.osd.opacity}
                    title="OSD Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
                <Option opt={options.theme.osd.bar_color} title="Bar" type="color" />
                <Option
                    opt={options.theme.osd.bar_overflow_color}
                    title="Bar Overflow"
                    subtitle="Overflow color is for when the volume goes over a 100"
                    type="color"
                />
                <Option opt={options.theme.osd.bar_empty_color} title="Bar Background" type="color" />
                <Option opt={options.theme.osd.bar_container} title="Bar Container" type="color" />
                <Option opt={options.theme.osd.icon} title="Icon" type="color" />
                <Option opt={options.theme.osd.icon_container} title="Icon Container" type="color" />
                <Option opt={options.theme.osd.label} title="Value Text" type="color" />
            </box>
        </scrollable>
    );
};
