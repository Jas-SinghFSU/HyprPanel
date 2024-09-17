import { Attribute, BoxWidget } from 'lib/types/widget';
import EventBox from 'types/widgets/eventbox';
import { BarLocation } from 'lib/types/options';

const createEventBox = (className: string, windowName: string): EventBox<BoxWidget, Attribute> => {
    return Widget.EventBox({
        class_name: className,
        hexpand: true,
        vexpand: false,
        can_focus: false,
        child: Widget.Box(),
        setup: (w) => {
            w.on('button-press-event', () => App.toggleWindow(windowName));
        },
    });
};

export const barEventMargins = (
    windowName: string,
    location: BarLocation = 'top',
): [EventBox<BoxWidget, Attribute>, EventBox<BoxWidget, Attribute>] => {
    if (location === 'top') {
        return [
            createEventBox('mid-eb event-top-padding-static', windowName),
            createEventBox('mid-eb event-top-padding', windowName),
        ];
    } else {
        return [
            createEventBox('mid-eb event-bottom-padding', windowName),
            createEventBox('mid-eb event-bottom-padding-static', windowName),
        ];
    }
};
