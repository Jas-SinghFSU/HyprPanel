import options from 'src/configuration';
import { BarEventMargins } from './helpers/eventBoxes';
import { globalEventBoxes } from 'src/lib/events/dropdown';
import { bind } from 'astal';
import { App, Astal, Gdk, Gtk } from 'astal/gtk3';
import { Revealer } from 'astal/gtk3/widget';
import { DropdownMenuProps, LocationMap } from './types';

const { location } = options.theme.bar;

export default ({
    name,
    child,
    transition,
    exclusivity = Astal.Exclusivity.IGNORE,
    ...props
}: DropdownMenuProps): JSX.Element => {
    const locationMap: LocationMap = {
        top: Astal.WindowAnchor.TOP,
        bottom: Astal.WindowAnchor.BOTTOM,
    };

    return (
        <window
            name={name}
            namespace={name}
            className={`${name} dropdown-menu`}
            onKeyPressEvent={(self, event) => {
                const key = event.get_keyval()[1];

                if (key === Gdk.KEY_Escape) {
                    self.visible = false;
                }
            }}
            onButtonPressEvent={(self, event) => {
                const buttonClicked = event.get_button()[1];

                if (buttonClicked === Gdk.BUTTON_PRIMARY || buttonClicked === Gdk.BUTTON_SECONDARY) {
                    self.visible = false;
                }
            }}
            visible={false}
            application={App}
            keymode={Astal.Keymode.ON_DEMAND}
            exclusivity={exclusivity}
            layer={Astal.Layer.TOP}
            anchor={bind(location).as((ln) => {
                if (locationMap[ln] === Astal.WindowAnchor.TOP) {
                    return Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT;
                }

                if (locationMap[ln] === Astal.WindowAnchor.BOTTOM) {
                    return Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT;
                }
            })}
            {...props}
        >
            <box vertical>
                {bind(location).as((lcn) => {
                    if (locationMap[lcn] === Astal.WindowAnchor.TOP) {
                        return <BarEventMargins windowName={name} />;
                    }
                    return <box />;
                })}
                <eventbox
                    className="in-eb menu-event-box"
                    onButtonPressEvent={(_, event) => {
                        const buttonClicked = event.get_button()[1];

                        if (buttonClicked === Gdk.BUTTON_PRIMARY || buttonClicked === Gdk.BUTTON_SECONDARY) {
                            return true;
                        }
                    }}
                    setup={(self) => {
                        globalEventBoxes.set({
                            ...globalEventBoxes.get(),
                            [name]: self,
                        });
                    }}
                >
                    <box className="dropdown-menu-container" css="padding: 1px; margin: -1px;">
                        <revealer
                            revealChild={false}
                            setup={(self: Revealer) => {
                                App.connect('window-toggled', (_, window) => {
                                    self.set_reveal_child(window.visible);
                                });
                            }}
                            transitionType={transition}
                            transitionDuration={bind(options.menus.transitionTime)}
                        >
                            <box className="dropdown-content" halign={Gtk.Align.CENTER} expand canFocus>
                                {child}
                            </box>
                        </revealer>
                    </box>
                </eventbox>
                {bind(location).as((lcn) => {
                    if (locationMap[lcn] === Astal.WindowAnchor.BOTTOM) {
                        return <BarEventMargins windowName={name} />;
                    }
                    return <box />;
                })}
            </box>
        </window>
    );
};
