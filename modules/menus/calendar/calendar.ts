import { BoxWidget } from 'lib/types/widget';

const CalendarWidget = (): BoxWidget => {
    return Widget.Box({
        class_name: 'calendar-menu-item-container calendar',
        hpack: 'fill',
        vpack: 'fill',
        expand: true,
        child: Widget.Box({
            class_name: 'calendar-container-box',
            child: Widget.Calendar({
                expand: true,
                hpack: 'fill',
                vpack: 'fill',
                class_name: 'calendar-menu-widget',
                showDayNames: true,
                showDetails: false,
                showHeading: true,
            }),
        }),
    });
};

export { CalendarWidget };
