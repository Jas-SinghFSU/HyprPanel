import 'greeter/scss/style.ts';
import './session';
import GLib from 'gi://GLib?version=2.0';
import RegularWindow from 'widget/RegularWindow';
import { auth } from './components/auth/index';
import { sessionTime } from './components/time/index';
import { loginControls } from './components/controls/index';

const win = RegularWindow({
    name: 'greeter',
    className: 'greeter-window',
    css: `background-image: url('/home/jaskir/Pictures/Wallpapers/RosePine/landscape.jpeg')`,
    setup: (self) => {
        self.set_default_size(1000, 1000);
        self.show_all();
    },
    child: Widget.Overlay({
        className: 'sessionOverlay',
        child: Widget.Box({ expand: true }),
        overlays: [
            Widget.Box({
                vertical: true,
                vpack: 'fill',
                hpack: 'fill',
                children: [sessionTime(), auth(), loginControls()],
            }),
        ],
    }),
});

App.config({
    windows: [win],
    cursorTheme: GLib.getenv('XCURSOR_THEME')!,
});
