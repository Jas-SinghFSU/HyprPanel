import { WINDOW_LAYOUTS } from 'globals/window';
import { LayoutFunction, Layouts, PopupWindowProps } from 'lib/types/popupwindow';
import { Attribute, Child, Exclusivity, GtkWidget, Transition } from 'lib/types/widget';
import Box from 'types/widgets/box';
import EventBox from 'types/widgets/eventbox';
import Window from 'types/widgets/window';

type Opts = {
    className: string;
    vexpand: boolean;
};

export const Padding = (name: string, opts: Opts): EventBox<Box<GtkWidget, Attribute>, unknown> =>
    Widget.EventBox({
        class_name: opts?.className || '',
        hexpand: true,
        vexpand: typeof opts?.vexpand === 'boolean' ? opts.vexpand : true,
        can_focus: false,
        child: Widget.Box(),
        setup: (w) => w.on('button-press-event', () => App.toggleWindow(name)),
    });

const PopupRevealer = (
    name: string,
    child: GtkWidget,
    transition = 'slide_down' as Transition,
): Box<Child, Attribute> =>
    Widget.Box(
        { css: 'padding: 1px;' },
        Widget.Revealer({
            transition,
            child: Widget.Box({
                class_name: `window-content ${name}-window`,
                child,
            }),
            transitionDuration: 200,
            setup: (self) =>
                self.hook(App, (_, wname, visible) => {
                    if (wname === name) self.reveal_child = visible;
                }),
        }),
    );

const Layout: LayoutFunction = (name: string, child: GtkWidget, transition: Transition) => ({
    center: () =>
        Widget.CenterBox(
            {},
            Padding(name, {} as Opts),
            Widget.CenterBox(
                { vertical: true },
                Padding(name, {} as Opts),
                PopupRevealer(name, child, transition),
                Padding(name, {} as Opts),
            ),
            Padding(name, {} as Opts),
        ),
    top: () =>
        Widget.CenterBox(
            {},
            Padding(name, {} as Opts),
            Widget.Box({ vertical: true }, PopupRevealer(name, child, transition), Padding(name, {} as Opts)),
            Padding(name, {} as Opts),
        ),
    'top-right': () =>
        Widget.Box(
            {},
            Padding(name, {} as Opts),
            Widget.Box(
                {
                    hexpand: false,
                    vertical: true,
                },
                Padding(name, {
                    vexpand: false,
                    className: 'event-top-padding',
                }),
                PopupRevealer(name, child, transition),
                Padding(name, {} as Opts),
            ),
        ),
    'top-center': () =>
        Widget.Box(
            {},
            Padding(name, {} as Opts),
            Widget.Box(
                {
                    hexpand: false,
                    vertical: true,
                },
                Padding(name, {
                    vexpand: false,
                    className: 'event-top-padding',
                }),
                PopupRevealer(name, child, transition),
                Padding(name, {} as Opts),
            ),
            Padding(name, {} as Opts),
        ),
    'top-left': () =>
        Widget.Box(
            {},
            Widget.Box(
                {
                    hexpand: false,
                    vertical: true,
                },
                Padding(name, {
                    vexpand: false,
                    className: 'event-top-padding',
                }),
                PopupRevealer(name, child, transition),
                Padding(name, {} as Opts),
            ),
            Padding(name, {} as Opts),
        ),
    'bottom-left': () =>
        Widget.Box(
            {},
            Widget.Box(
                {
                    hexpand: false,
                    vertical: true,
                },
                Padding(name, {} as Opts),
                PopupRevealer(name, child, transition),
            ),
            Padding(name, {} as Opts),
        ),
    'bottom-center': () =>
        Widget.Box(
            {},
            Padding(name, {} as Opts),
            Widget.Box(
                {
                    hexpand: false,
                    vertical: true,
                },
                Padding(name, {} as Opts),
                PopupRevealer(name, child, transition),
            ),
            Padding(name, {} as Opts),
        ),
    'bottom-right': () =>
        Widget.Box(
            {},
            Padding(name, {} as Opts),
            Widget.Box(
                {
                    hexpand: false,
                    vertical: true,
                },
                Padding(name, {} as Opts),
                PopupRevealer(name, child, transition),
            ),
        ),
});

const isValidLayout = (layout: string): layout is Layouts => {
    return WINDOW_LAYOUTS.includes(layout);
};

export default ({
    name,
    child,
    layout = 'center',
    transition = 'none',
    exclusivity = 'ignore' as Exclusivity,
    ...props
}: PopupWindowProps): Window<Child, Attribute> => {
    const layoutFn = isValidLayout(layout) ? layout : 'center';

    const layoutWidget = Layout(name, child, transition)[layoutFn]();

    return Widget.Window({
        name,
        class_names: [name, 'popup-window'],
        setup: (w) => w.keybind('Escape', () => App.closeWindow(name)),
        visible: false,
        keymode: 'on-demand',
        exclusivity,
        layer: 'top',
        anchor: ['top', 'bottom', 'right', 'left'],
        child: layoutWidget,
        ...props,
    });
};
