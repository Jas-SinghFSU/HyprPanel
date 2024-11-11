import 'greeter/scss/style.ts';
import './session';
import GLib from 'gi://GLib?version=2.0';
import RegularWindow from 'widget/RegularWindow';
import auth from './components/auth/index';

const win = RegularWindow({
    name: 'greeter',
    className: 'greeter-window',
    css: `background-image: url('/home/jaskir/Pictures/Wallpapers/RosePine/landscape.jpeg')`,
    setup: (self) => {
        self.set_default_size(1000, 1000);
        self.show_all();
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
