import { BoxWidget } from 'lib/types/widget';
import options from 'options';

const { military, hideSeconds } = options.menus.clock.time;

const time = Variable('', {
    poll: [1000, 'date "+%I:%M:%S"'],
});

const period = Variable('', {
    poll: [1000, 'date "+%p"'],
});

const militaryTime = Variable('', {
    poll: [1000, 'date "+%H:%M:%S"'],
});

const TimeWidget = (): BoxWidget => {
    return Widget.Box({
        class_name: 'calendar-menu-item-container clock',
        hexpand: true,
        vpack: 'center',
        hpack: 'fill',
        child: Widget.Box({
            hexpand: true,
            vpack: 'center',
            hpack: 'center',
            class_name: 'clock-content-items',
            children: Utils.merge(
                [military.bind('value'), hideSeconds.bind('value')],
                (is24hr: boolean, hideSeconds: boolean) => {
                    if (!is24hr) {
                        return [
                            Widget.Box({
                                hpack: 'center',
                                children: [
                                    Widget.Label({
                                        class_name: 'clock-content-time',
                                        label: hideSeconds ? time.bind().as((str) => str.slice(0, -3)) : time.bind(),
                                    }),
                                ],
                            }),
                            Widget.Box({
                                hpack: 'center',
                                children: [
                                    Widget.Label({
                                        vpack: 'end',
                                        class_name: 'clock-content-period',
                                        label: period.bind(),
                                    }),
                                ],
                            }),
                        ];
                    }

                    return [
                        Widget.Box({
                            hpack: 'center',
                            children: [
                                Widget.Label({
                                    class_name: 'clock-content-time',
                                    label: hideSeconds
                                        ? militaryTime.bind().as((str) => str.slice(0, -3))
                                        : militaryTime.bind(),
                                }),
                            ],
                        }),
                    ];
                },
            ),
        }),
    });
};

export { TimeWidget };
