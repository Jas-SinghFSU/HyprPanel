import { Exclusivity, Transition } from "lib/types/widget";

type Opts = {
    className: string
    vexpand: boolean
}

export const Padding = (name: string, opts: Opts) =>
    Widget.EventBox({
        class_name: opts?.className || "",
        hexpand: true,
        vexpand: typeof opts?.vexpand === "boolean" ? opts.vexpand : true,
        can_focus: false,
        child: Widget.Box(),
        setup: (w) => w.on("button-press-event", () => App.toggleWindow(name)),
    });

const PopupRevealer = (name: string, child: any, transition = "slide_down" as Transition) =>
    Widget.Box(
        { css: "padding: 1px;" },
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

const Layout = (name: string, child: any, transition: Transition) => ({
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
            Widget.Box(
                { vertical: true },
                PopupRevealer(name, child, transition),
                Padding(name, {} as Opts),
            ),
            Padding(name, {} as Opts),
        ),
    "top-right": () =>
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
                    className: "event-top-padding",
                }),
                PopupRevealer(name, child, transition),
                Padding(name, {} as Opts),
            ),
        ),
    "top-center": () =>
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
                    className: "event-top-padding",
                }),
                PopupRevealer(name, child, transition),
                Padding(name, {} as Opts),
            ),
            Padding(name, {} as Opts),
        ),
    "top-left": () =>
        Widget.Box(
            {},
            Widget.Box(
                {
                    hexpand: false,
                    vertical: true,
                },
                Padding(name, {
                    vexpand: false,
                    className: "event-top-padding",
                }),
                PopupRevealer(name, child, transition),
                Padding(name, {} as Opts),
            ),
            Padding(name, {} as Opts),
        ),
    "bottom-left": () =>
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
    "bottom-center": () =>
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
    "bottom-right": () =>
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

export default ({
    name,
    child,
    layout = "center",
    transition,
    exclusivity = "ignore" as Exclusivity,
    ...props
}) =>
    Widget.Window({
        name,
        class_names: [name, "popup-window"],
        setup: (w) => w.keybind("Escape", () => App.closeWindow(name)),
        visible: false,
        keymode: "on-demand",
        exclusivity,
        layer: "top",
        anchor: ["top", "bottom", "right", "left"],
        child: Layout(name, child, transition)[layout](),
        ...props,
    });
