import { App, Astal, Gdk, Gtk } from 'astal/gtk3';
import { WINDOW_LAYOUTS } from 'src/globals/window';
import { LayoutFunction, Layouts, PaddingProps, PopupRevealerProps, PopupWindowProps } from 'src/lib/types/popupwindow';
import { Exclusivity, GtkWidget } from 'src/lib/types/widget';
import { EventBox, Revealer } from 'astal/gtk3/widget';

export const Padding = ({ name, opts }: PaddingProps): JSX.Element => (
    <eventbox
        className={opts?.className ?? ''}
        hexpand
        vexpand={typeof opts?.vexpand === 'boolean' ? opts.vexpand : true}
        canFocus={false}
        setup={(self: EventBox) => self.connect('button-press-event', () => App.toggle_window(name))}
    >
        <box />
    </eventbox>
);

const PopupRevealer = ({ name, child, transition }: PopupRevealerProps): JSX.Element => (
    <box css={'padding: 1px'}>
        <revealer
            transitionType={transition}
            transition_duration={200}
            setup={(self: Revealer) => {
                App.connect('window-toggled', (app) => {
                    self.revealChild = app.get_window(name)?.is_visible() ?? false;
                });
            }}
        >
            <box className={`window-content ${name}-window`}>{child}</box>
        </revealer>
    </box>
);

const Layout: LayoutFunction = (name: string, child: GtkWidget, transition: Gtk.RevealerTransitionType) => ({
    center: () => (
        <centerbox>
            <Padding name={name} />
            <centerbox vertical>
                <Padding name={name} />
                <PopupRevealer name={name} child={child} transition={transition} />
                <Padding name={name} />
            </centerbox>
            <Padding name={name} />
        </centerbox>
    ),
    top: () => (
        <centerbox>
            <Padding name={name} />
            <box vertical>
                <PopupRevealer name={name} child={child} transition={transition} />
                <Padding name={name} />
            </box>
            <Padding name={name} />
        </centerbox>
    ),
    'top-right': () => (
        <box>
            <Padding name={name} />
            <box hexpand vertical>
                <Padding name={name} opts={{ vexpand: false, className: 'event-top-padding' }} />
                <PopupRevealer name={name} child={child} transition={transition} />
                <Padding name={name} />
            </box>
        </box>
    ),
    'top-center': () => (
        <box>
            <Padding name={name} />
            <box hexpand={false} vertical>
                <Padding name={name} opts={{ vexpand: false, className: 'event-top-padding' }} />
                <PopupRevealer name={name} child={child} transition={transition} />
                <Padding name={name} />
            </box>
            <Padding name={name} />
        </box>
    ),
    'top-left': () => (
        <box>
            <Padding name={name} />
            <box hexpand={false} vertical>
                <Padding name={name} opts={{ vexpand: false, className: 'event-top-padding' }} />
                <PopupRevealer name={name} child={child} transition={transition} />
                <Padding name={name} />
            </box>
            <Padding name={name} />
        </box>
    ),
    'bottom-left': () => (
        <box>
            <box hexpand={false} vertical>
                <Padding name={name} />
                <PopupRevealer name={name} child={child} transition={transition} />
            </box>
            <Padding name={name} />
        </box>
    ),
    'bottom-center': () => (
        <box>
            <Padding name={name} />
            <box hexpand={false} vertical>
                <Padding name={name} />
                <PopupRevealer name={name} child={child} transition={transition} />
            </box>
            <Padding name={name} />
        </box>
    ),
    'bottom-right': () => (
        <box>
            <Padding name={name} />
            <box hexpand={false} vertical>
                <Padding name={name} />
                <PopupRevealer name={name} child={child} transition={transition} />
            </box>
        </box>
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
}: PopupWindowProps): JSX.Element => {
    const layoutFn = isValidLayout(layout) ? layout : 'center';

    const layoutWidget = Layout(name, child, transition)[layoutFn]();

    return (
        <window
            name={name}
            namespace={name}
            className={`${name} popup-window`}
            onKeyPressEvent={(_, event) => {
                const key = event.get_keyval()[1];

                if (key === Gdk.KEY_Escape) {
                    App.get_window(name)?.set_visible(false);
                }
            }}
            visible={false}
            keymode={Astal.Keymode.ON_DEMAND}
            exclusivity={exclusivity}
            application={App}
            layer={Astal.Layer.TOP}
            anchor={
                Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.LEFT
            }
            {...props}
        >
            {layoutWidget}
        </window>
    );
};
