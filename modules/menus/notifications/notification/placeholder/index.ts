import { BoxWidget } from 'lib/types/widget';
import { Notifications } from 'types/service/notifications';

const Placeholder = (notifs: Notifications): BoxWidget => {
    return Widget.Box({
        class_name: 'notification-label-container',
        vpack: 'fill',
        hpack: 'center',
        expand: true,
        child: Widget.Box({
            vpack: 'center',
            vertical: true,
            expand: true,
            children: [
                Widget.Label({
                    vpack: 'center',
                    class_name: 'placeholder-label dim bell txt-icon',
                    label: notifs.bind('dnd').as((dnd) => (dnd ? '󰂛' : '󰂚')),
                }),
                Widget.Label({
                    vpack: 'start',
                    class_name: 'placehold-label dim message',
                    label: "You're all caught up :)",
                }),
            ],
        }),
    });
};

export { Placeholder };
