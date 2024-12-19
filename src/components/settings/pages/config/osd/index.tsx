import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';
import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const OSDSettings = (): JSX.Element => {
    return (
        <scrollable name={'OSD'} vscroll={Gtk.PolicyType.AUTOMATIC}>
            <box className="bar-theme-page paged-container" vertical>
                <Header title="On Screen Display" />
                <Option opt={options.theme.osd.enable} title="Enabled" type="boolean" />
                <Option
                    opt={options.theme.osd.duration}
                    title="Duration"
                    type="number"
                    min={100}
                    max={10000}
                    increment={500}
                />
                <Option
                    opt={options.theme.osd.orientation}
                    title="Orientation"
                    type="enum"
                    enums={['horizontal', 'vertical']}
                />
                <Option
                    opt={options.theme.osd.location}
                    title="Position"
                    subtitle="Position of OSD"
                    type="enum"
                    enums={['top left', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left']}
                />
                <Option
                    opt={options.theme.osd.monitor}
                    title="Monitor"
                    subtitle="Monitor ID for OSD display"
                    type="number"
                />
                <Option
                    opt={options.theme.osd.active_monitor}
                    title="Follow Cursor"
                    subtitle="OSD follows monitor of cursor"
                    type="boolean"
                />
                <Option opt={options.theme.osd.radius} title="Radius" subtitle="Radius of the OSD" type="string" />
                <Option
                    opt={options.theme.osd.margins}
                    title="Margins"
                    subtitle="Format: top right bottom left"
                    type="string"
                />
                <Option
                    opt={options.theme.osd.muted_zero}
                    title="Mute Volume as Zero"
                    subtitle="Display volume as 0 when muting"
                    type="boolean"
                />
            </box>
        </scrollable>
    );
};
