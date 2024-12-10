import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';

export const MediaMenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'Media Menu'}
            className="menu-theme-page media paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <box vertical>
                {/* Media Menu Theme Settings Section */}
                <Header title="Media Menu Theme Settings" />
                <Option opt={options.theme.bar.menus.menu.media.song} title="Song" type="color" />
                <Option opt={options.theme.bar.menus.menu.media.artist} title="Artist" type="color" />
                <Option opt={options.theme.bar.menus.menu.media.album} title="Album" type="color" />
                <Option opt={options.theme.bar.menus.menu.media.timestamp} title="Time Stamp" type="color" />

                {/* Background Section */}
                <Header title="Background" />
                <Option opt={options.theme.bar.menus.menu.media.background.color} title="Background" type="color" />

                {/* Border Section */}
                <Header title="Border" />
                <Option opt={options.theme.bar.menus.menu.media.border.color} title="Border" type="color" />

                {/* Card/Album Art Section */}
                <Header title="Card/Album Art" />
                <Option opt={options.theme.bar.menus.menu.media.card.color} title="Color" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.media.card.tint}
                    title="Tint"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />

                {/* Buttons Section */}
                <Header title="Buttons" />
                <Option
                    opt={options.theme.bar.menus.menu.media.buttons.inactive}
                    title="Unavailable"
                    subtitle="Disabled button when media control isn't available."
                    type="color"
                />
                <Option
                    opt={options.theme.bar.menus.menu.media.buttons.enabled}
                    title="Enabled"
                    subtitle="Ex: Button color when shuffle/loop is enabled."
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.media.buttons.background} title="Background" type="color" />
                <Option opt={options.theme.bar.menus.menu.media.buttons.text} title="Text" type="color" />

                {/* Slider Section */}
                <Header title="Slider" />
                <Option opt={options.theme.bar.menus.menu.media.slider.primary} title="Primary Color" type="color" />
                <Option opt={options.theme.bar.menus.menu.media.slider.background} title="Background" type="color" />
                <Option
                    opt={options.theme.bar.menus.menu.media.slider.backgroundhover}
                    title="Background (Hover)"
                    type="color"
                />
                <Option opt={options.theme.bar.menus.menu.media.slider.puck} title="Puck" type="color" />
            </box>
        </scrollable>
    );
};
