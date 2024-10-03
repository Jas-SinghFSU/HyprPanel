import Gdk from 'gi://Gdk?version=3.0';
import { BarBoxChild, SelfButton } from 'lib/types/bar';
import { Notify } from 'lib/utils';
const systemtray = await Service.import('systemtray');
import options from 'options';

const { ignore } = options.bar.systray;

const SysTray = (): BarBoxChild => {
    const isVis = Variable(false);

    const items = Utils.merge([systemtray.bind('items'), ignore.bind('value')], (items, ignored) => {
        const filteredTray = items.filter(({ id }) => !ignored.includes(id));

        isVis.value = filteredTray.length > 0;

        return filteredTray.map((item) => {
            return Widget.Button({
                cursor: 'pointer',
                child: Widget.Icon({
                    class_name: 'systray-icon',
                    icon: item.bind('icon'),
                }),
                on_primary_click: (_: SelfButton, event: Gdk.Event) => item.activate(event),
                on_secondary_click: (_, event) => item.openMenu(event),
                onMiddleClick: () => Notify({ summary: 'App Name', body: item.id }),
                tooltip_markup: item.bind('tooltip_markup'),
            });
        });
    });

    return {
        component: Widget.Box({
            class_name: 'systray-container',
            children: items,
        }),
        isVisible: true,
        boxClass: 'systray',
        isVis,
        props: {},
    };
};

export { SysTray };
