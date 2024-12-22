import { Option } from 'src/components/settings/shared/Option';
import { Header } from 'src/components/settings/shared/Header';

import options from 'src/options';
import { Gtk } from 'astal/gtk3';
import { bind } from 'astal';

export const MenuTheme = (): JSX.Element => {
    return (
        <scrollable
            name={'General Settings'}
            className="menu-theme-page paged-container"
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            vexpand
        >
            <box vertical>
                {/* General Section */}
                <Header title="General" />
                <Option
                    opt={options.dummy}
                    title="Theme"
                    subtitle="WARNING: Importing a theme will replace your current theme color settings."
                    type="config_import"
                    exportData={{ filePath: CONFIG, themeOnly: true }}
                />
                <Option
                    opt={options.theme.bar.menus.monochrome}
                    title="Use Global Colors"
                    type="boolean"
                    disabledBinding={options.theme.matugen}
                />
                <Option
                    opt={options.wallpaper.pywal}
                    title="Generate Pywal Colors"
                    subtitle="Whether to also generate pywal colors with chosen wallpaper"
                    type="boolean"
                />
                <Option
                    opt={options.wallpaper.enable}
                    title="Apply Wallpapers"
                    subtitle="Whether to apply the wallpaper or to only use it for Matugen color generation."
                    type="boolean"
                />
                <Option
                    opt={options.wallpaper.image}
                    title="Wallpaper"
                    subtitle={bind(options.wallpaper.image).as((wallpaper) => wallpaper || 'No Wallpaper Selected')}
                    type="wallpaper"
                />
                <Option opt={options.theme.bar.menus.background} title="Background Color" type="color" />
                <Option
                    opt={options.theme.bar.menus.opacity}
                    title="Menu Opacity"
                    type="number"
                    increment={5}
                    min={0}
                    max={100}
                />
                <Option opt={options.theme.bar.menus.cards} title="Cards" type="color" />
                <Option opt={options.theme.bar.menus.card_radius} title="Card Radius" type="string" />
                <Option opt={options.theme.bar.menus.text} title="Primary Text" type="color" />
                <Option opt={options.theme.bar.menus.dimtext} title="Dim Text" type="color" />
                <Option opt={options.theme.bar.menus.feinttext} title="Feint Text" type="color" />
                <Option opt={options.theme.bar.menus.label} title="Label Color" type="color" />

                {/* Border Section */}
                <Header title="Border" />
                <Option opt={options.theme.bar.menus.border.size} title="Border Width" type="string" />
                <Option opt={options.theme.bar.menus.border.radius} title="Border Radius" type="string" />
                <Option opt={options.theme.bar.menus.border.color} title="Border Color" type="color" />

                {/* Popover Section */}
                <Header title="Popover" />
                <Option opt={options.theme.bar.menus.popover.radius} title="Popover Radius" type="string" />
                <Option opt={options.theme.bar.menus.popover.text} title="Text" type="color" />
                <Option opt={options.theme.bar.menus.popover.background} title="Background" type="color" />

                {/* List Items Section */}
                <Header title="List Items" />
                <Option
                    opt={options.theme.bar.menus.listitems.active}
                    title="Active"
                    subtitle={
                        'Items of a list (network name, bluetooth device name, ' +
                        'playback device, etc.) when active or hovered.'
                    }
                    type="color"
                />
                <Option opt={options.theme.bar.menus.listitems.passive} title="Passive" type="color" />

                {/* Icons Section */}
                <Header title="Icons" />
                <Option opt={options.theme.bar.menus.icons.active} title="Active" type="color" />
                <Option opt={options.theme.bar.menus.icons.passive} title="Passive" type="color" />

                {/* Switch Section */}
                <Header title="Switch" />
                <Option opt={options.theme.bar.menus.switch.enabled} title="Enabled" type="color" />
                <Option opt={options.theme.bar.menus.switch.disabled} title="Disabled" type="color" />
                <Option opt={options.theme.bar.menus.switch.radius} title="Switch Radius" type="string" />
                <Option opt={options.theme.bar.menus.switch.slider_radius} title="Switch Puck Radius" type="string" />
                <Option opt={options.theme.bar.menus.switch.puck} title="Puck" type="color" />

                {/* Check/Radio Buttons Section */}
                <Header title="Check/Radio Buttons" />
                <Option opt={options.theme.bar.menus.check_radio_button.background} title="Background" type="color" />
                <Option opt={options.theme.bar.menus.check_radio_button.active} title="Active" type="color" />

                {/* Buttons Section */}
                <Header title="Buttons" />
                <Option opt={options.theme.bar.menus.buttons.radius} title="Button Radius" type="string" />
                <Option opt={options.theme.bar.menus.buttons.default} title="Primary" type="color" />
                <Option opt={options.theme.bar.menus.buttons.active} title="Active" type="color" />
                <Option opt={options.theme.bar.menus.buttons.disabled} title="Disabled" type="color" />
                <Option opt={options.theme.bar.menus.buttons.text} title="Text" type="color" />

                {/* Icon Buttons Section */}
                <Header title="Icon Buttons" />
                <Option opt={options.theme.bar.menus.iconbuttons.passive} title="Primary" type="color" />
                <Option opt={options.theme.bar.menus.iconbuttons.active} title="Active/Hovered" type="color" />

                {/* Progress Bar Section */}
                <Header title="Progress Bar" />
                <Option opt={options.theme.bar.menus.progressbar.radius} title="Progress Bar Radius" type="string" />
                <Option opt={options.theme.bar.menus.progressbar.foreground} title="Primary" type="color" />
                <Option opt={options.theme.bar.menus.progressbar.background} title="Background" type="color" />

                {/* Slider Section */}
                <Header title="Slider" />
                <Option opt={options.theme.bar.menus.slider.primary} title="Primary" type="color" />
                <Option opt={options.theme.bar.menus.slider.background} title="Background" type="color" />
                <Option opt={options.theme.bar.menus.slider.backgroundhover} title="Background (Hover)" type="color" />
                <Option opt={options.theme.bar.menus.slider.slider_radius} title="Slider Puck Radius" type="string" />
                <Option
                    opt={options.theme.bar.menus.slider.progress_radius}
                    title="Slider/Progress Bar Radius"
                    type="string"
                />
                <Option opt={options.theme.bar.menus.slider.puck} title="Puck" type="color" />

                {/* Scroller Section */}
                <Header title="Scroller" />
                <Option opt={options.theme.bar.menus.scroller.radius} title="Radius" type="string" />
                <Option opt={options.theme.bar.menus.scroller.width} title="Width" type="string" />

                {/* Dropdown Menu Section */}
                <Header title="Dropdown Menu" />
                <Option opt={options.theme.bar.menus.dropdownmenu.background} title="Background" type="color" />
                <Option opt={options.theme.bar.menus.dropdownmenu.text} title="Text" type="color" />
                <Option opt={options.theme.bar.menus.dropdownmenu.divider} title="Divider" type="color" />

                {/* Tooltips Section */}
                <Header title="Tooltips" />
                <Option opt={options.theme.bar.menus.tooltip.radius} title="Tooltip Radius" type="string" />
                <Option opt={options.theme.bar.menus.tooltip.background} title="Background" type="color" />
                <Option opt={options.theme.bar.menus.tooltip.text} title="Text" type="color" />
            </box>
        </scrollable>
    );
};
