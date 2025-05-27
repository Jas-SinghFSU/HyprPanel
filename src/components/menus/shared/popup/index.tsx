import { App, Astal, Gdk, Gtk } from 'astal/gtk3';
import { POPUP_LAYOUTS } from 'src/components/menus/shared/popup/layouts';
import { EventBox, Revealer } from 'astal/gtk3/widget';
import { LayoutFunction, Layouts, PaddingProps, PopupRevealerProps, PopupWindowProps } from './types';

const Padding = ({ name, opts }: PaddingProps): JSX.Element => (
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

const Layout: LayoutFunction = (name, child, transition) => ({
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
            <box hexpand={false} vertical>
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
            <box hexpand={false} vertical>
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
    return POPUP_LAYOUTS.includes(layout);
};

export default ({
    name,
    child = <box />,
    layout = 'center',
    transition = Gtk.RevealerTransitionType.NONE,
    exclusivity = Astal.Exclusivity.IGNORE,
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
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.LEFT
            }
            {...props}
        >
            {layoutWidget}
        </window>
    );
};
