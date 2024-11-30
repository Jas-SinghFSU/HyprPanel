import options from 'src/options';
import { DropdownMenuProps } from 'src/lib/types/dropdownmenu';
import { Exclusivity } from 'src/lib/types/widget';
import { barEventMargins } from './eventBoxes/index';
import { globalEventBoxes } from 'src/globals/dropdown';
import { bind, Variable } from 'astal';
import { App, Astal, Gdk } from 'astal/gtk3';
import { Revealer } from 'astal/gtk3/widget';

const { location } = options.theme.bar;

// NOTE: We make the window visible for 2 seconds (on startup) so the child
// elements can allocate their proper dimensions.
// Otherwise the width that we rely on for menu positioning is set improperly
// for the first time we open a menu of each type.
const initRender = Variable(true);

// setTimeout(() => {
//     initRender.set(false);
// }, 2000);

export default ({
    name,
    child,
    transition,
    exclusivity = 'ignore' as Exclusivity,
    ...props
}: DropdownMenuProps): JSX.Element => {
    return (
        <window
            name={name}
            className={`${name} dropdown-menu`}
            onKeyPressEvent={(_, event) => {
                const key = event.get_keyval()[1];

                if (key === Gdk.KEY_Escape) {
                    App.get_window(name)?.set_visible(false);
                }
            }}
            visible={bind(initRender)}
            application={App}
            keymode={Astal.Keymode.ON_DEMAND}
            exclusivity={exclusivity}
            layer={Astal.Layer.TOP}
            anchor={bind(location).as((ln) => {
                if (ln === Astal.WindowAnchor.TOP) {
                    return Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT;
                }

                if (ln === Astal.WindowAnchor.BOTTOM) {
                    return Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT;
                }
            })}
            {...props}
        >
            <eventbox
                className="parent-event"
                onClick={(_, event) => {
                    if (event.button === Gdk.BUTTON_PRIMARY) {
                        log('clicked parent-event');
                        return App.get_window(name)?.set_visible(false);
                    }

                    if (event.button === Gdk.BUTTON_SECONDARY) {
                        log('clicked parent-event');
                        return App.get_window(name)?.set_visible(false);
                    }
                }}
            >
                <box className="top-eb" vertical>
                    <box
                        className="event-box-container"
                        children={bind(location).as((lcn) => {
                            if (lcn === Astal.WindowAnchor.TOP) {
                                return barEventMargins(name);
                            } else {
                                return [];
                            }
                        })}
                    />
                    <eventbox
                        className="in-eb menu-event-box"
                        onClick={(_, event) => {
                            if (event.button === Gdk.BUTTON_PRIMARY) {
                                log('clicked in-eb');
                                return true;
                            }
                            if (event.button === Gdk.BUTTON_SECONDARY) {
                                log('clicked in-eb');
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
                                    App.connect('window-toggled', (app) => {
                                        const targetWindow = app.get_window(name);
                                        const visibility = targetWindow?.get_visible();

                                        if (targetWindow?.name === name) {
                                            self.set_reveal_child(visibility ?? false);
                                        }
                                    });
                                }}
                                transitionType={transition}
                                transitionDuration={bind(options.menus.transitionTime)}
                            >
                                <box className="dropdown-menu-container" canFocus>
                                    {child}
                                </box>
                            </revealer>
                        </box>
                    </eventbox>
                    <box
                        className="event-box-container"
                        children={bind(location).as((lcn) => {
                            if (lcn === Astal.WindowAnchor.BOTTOM) {
                                return barEventMargins(name);
                            } else {
                                return [];
                            }
                        })}
                    />
                </box>
            </eventbox>
        </window>
    );
};
