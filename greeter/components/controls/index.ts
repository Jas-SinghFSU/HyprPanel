import GLib from 'gi://GLib?version=2.0';
import { GtkWidget } from 'lib/types/widget';
import { DateTime } from 'types/@girs/glib-2.0/glib-2.0.cjs';

const timeFormat = '%I:%M:%S %p';
const dateFormat = '%a %b %d';

const date = Variable(GLib.DateTime.new_now_local(), {
    poll: [1000, (): DateTime => GLib.DateTime.new_now_local()],
});
const currentTime = Utils.derive([date], (c) => c.format(timeFormat) || '');
const currentDate = Utils.derive([date], (c) => c.format(dateFormat) || '');

export const loginControls = (): GtkWidget => {
    return Widget.Box({
        className: 'loginControls',
        expand: true,
        vpack: 'center',
        vertical: true,
        children: [
            Widget.Label({
                label: '',
            }),
            Widget.Label({
                label: '',
            }),
        ],
    });
};
