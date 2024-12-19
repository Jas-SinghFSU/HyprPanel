import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const VolumeMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Volume Menu'}
            className="menu-theme-page volume paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Volume Menu Theme Settings Section */}
                <Header title="Volume Menu Theme Settings" />
                <Option opt={options.theme.bar.menus.menu.volume.text} title="Text" type="color" />

                {/* Card Section */}
                <Header title="Card" />
                <Option opt={options.theme.bar.menus.menu.volume.card.color} title="Card" type="color" />

                {/* Background Section */}
                <Header title="Background" />
                <Option opt={options.theme.bar.menus.menu.volume.background.color} title="Background" type="color" />

                {/* Border Section */}
                <Header title="Border" />
                <Option opt={options.theme.bar.menus.menu.volume.border.color} title="Border" type="color" />

                {/* Label Section */}
                <Header title="Label" />
                <Option opt={options.theme.bar.menus.menu.volume.label.color} title="Label" type="color" />

                {/* List Items Section */}
                <Header title="List Items" />
                <Option opt={options.theme.bar.menus.menu.volume.listitems.active} title="Active/Hover" type="color" />
                <Option opt={options.theme.bar.menus.menu.volume.listitems.passive} title="Passive" type="color" />

                {/* Icon Button Section */}
                <Header title="Icon Button" />
                <Option opt={options.theme.bar.menus.menu.volume.iconbutton.active} title="Active/Hover" type="color" />
                <Option opt={options.theme.bar.menus.menu.volume.iconbutton.passive} title="Passive" type="color" />

                {/* Audio Slider Section */}
                <Header title="Audio Slider" />
                <Option opt={options.theme.bar.menus.menu.volume.audio_slider.primary} title="Primary" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.volume.audio_slider.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.volume.audio_slider.backgroundhover}
                    title="Background (Hover)"
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.volume.audio_slider.puck} title="Puck" type="color" />

                {/* Input Slider Section */}
                <Header title="Input Slider" />
                <Option opt={options.theme.bar.menus.menu.volume.input_slider.primary} title="Primary" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.volume.input_slider.background}
                    title="Background"
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.volume.input_slider.backgroundhover}
                    title="Background (Hover)"
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.volume.input_slider.puck} title="Puck" type="color" />
            </box>
        </scrollable>
    );
};
