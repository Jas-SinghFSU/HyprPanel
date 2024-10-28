import options from 'options';
import { DropdownMenuProps } from 'lib/types/dropdownmenu';
import { Attribute, Child, Exclusivity } from 'lib/types/widget';
import Window from 'types/widgets/window';
import { barEventMargins } from './eventBoxes/index';
import { globalEventBoxes } from 'globals/dropdown';

const { location } = options.theme.bar;

// NOTE: We make the window visible for 2 seconds (on startup) so the child
// elements can allocate their proper dimensions.
// Otherwise the width that we rely on for menu positioning is set improperly
// for the first time we open a menu of each type.
const initRender = Variable(true);

setTimeout(() => {
    initRender.value = false;
}, 2000);

export default ({
    name,
    child,
    transition,
    exclusivity = 'ignore' as Exclusivity,
    ...props
}: DropdownMenuProps): Window<Child, Attribute> =>
    Widget.Window({
        name,
        class_names: [name, 'dropdown-menu'],
        setup: (w) => w.keybind('Escape', () => App.closeWindow(name)),
        visible: initRender.bind('value'),
        keymode: 'on-demand',
        exclusivity,
        layer: 'top',
        anchor: location.bind('value').as((ln) => [ln, 'left']),
        child: Widget.EventBox({
            class_name: 'parent-event',
            on_primary_click: () => App.closeWindow(name),
            on_secondary_click: () => App.closeWindow(name),
            child: Widget.Box({
                class_name: 'top-eb',
                vertical: true,
                children: [
                    Widget.Box({
                        className: 'event-box-container',
                        children: location.bind('value').as((lcn) => {
                            if (lcn === 'top') {
                                return barEventMargins(name);
                            } else {
                                return [];
                            }
                        }),
                    }),
                    Widget.EventBox({
                        class_name: 'in-eb menu-event-box',
                        on_primary_click: () => {
                            return true;
                        },
                        on_secondary_click: () => {
                            return true;
                        },
                        setup: (self) => {
                            globalEventBoxes.value[name] = self;
                        },
                        child: Widget.Box({
                            class_name: 'dropdown-menu-container',
                            css: 'padding: 1px; margin: -1px;',
                            child: Widget.Revealer({
                                revealChild: false,
                                setup: (self) =>
                                    self.hook(App, (_, wname, visible) => {
                                        if (wname === name) self.reveal_child = visible;
                                    }),
                                transition,
                                transitionDuration: options.menus.transitionTime.bind('value'),
                                child: Widget.Box({
                                    class_name: 'dropdown-menu-container',
                                    can_focus: true,
                                    children: [child],
                                }),
                            }),
                        }),
                    }),
                    Widget.Box({
                        className: 'event-box-container',
                        children: location.bind('value').as((lcn) => {
                            if (lcn === 'bottom') {
                                return barEventMargins(name);
                            } else {
                                return [];
                            }
                        }),
                    }),
                ],
            }),
        }),
        ...props,
    });
