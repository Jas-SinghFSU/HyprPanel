import 'greeter/scss/style.ts';
import './session';
import GLib from 'gi://GLib?version=2.0';
import RegularWindow from 'widget/RegularWindow';
import auth from './auth';

const win = RegularWindow({
    name: 'greeter',
    className: 'greeter-window',
    setup: (self) => {
        self.set_default_size(1000, 1000);
        self.show_all();
        auth.attribute.password.grab_focus();
    },
    child: Widget.Overlay({
        child: Widget.Box({ expand: true }),
        overlays: [
            Widget.Box({
                vpack: 'center',
                hpack: 'center',
                child: auth,
            }),
        ],
    }),
});

App.config({
    windows: [win],
    cursorTheme: GLib.getenv('XCURSOR_THEME')!,
});
