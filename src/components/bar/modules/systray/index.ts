import { Gdk, Widget } from 'astal/gtk3';
import { Notify } from '../../../../lib/utils';
import options from '../../../../options';
import AstalTray from 'gi://AstalTray?version=0.1';
import { GtkWidget } from '../../../../lib/types/widget';
import Variable from 'astal/variable';

const systemtray = AstalTray.get_default();
const { ignore, customIcons } = options.bar.systray;

const SysTray = (): GtkWidget => {
    const isVis = Variable(false);

    // const items = Utils.merge(
    //     [systemtray.bind('items'), ignore.bind('value'), customIcons.bind('value')],
    //     (items, ignored, custIcons) => {
    //         const filteredTray = items.filter(({ id }) => !ignored.includes(id) && id !== null);
    //
    //         isVis.value = filteredTray.length > 0;
    //
    //         return filteredTray.map((item) => {
    //             const matchedCustomIcon = Object.keys(custIcons).find((iconRegex) => item.id.match(iconRegex));
    //
    //             if (matchedCustomIcon !== undefined) {
    //                 const iconLabel = custIcons[matchedCustomIcon].icon || '󰠫';
    //                 const iconColor = custIcons[matchedCustomIcon].color;
    //
    //                 return Widget.Button({
    //                     cursor: 'pointer',
    //                     child: Widget.Label({
    //                         class_name: 'systray-icon txt-icon',
    //                         label: iconLabel,
    //                         css: iconColor ? `color: ${iconColor}` : '',
    //                     }),
    //                     on_primary_click: (_: SelfButton, event: Gdk.Event) => item.activate(event),
    //                     on_secondary_click: (_, event) => item.openMenu(event),
    //                     onMiddleClick: () => Notify({ summary: 'App Name', body: item.id }),
    //                     tooltip_markup: item.bind('tooltip_markup'),
    //                 });
    //             }
    //
    //             return Widget.Button({
    //                 cursor: 'pointer',
    //                 child: Widget.Icon({
    //                     class_name: 'systray-icon',
    //                     icon: item.bind('icon'),
    //                 }),
    //                 on_primary_click: (_: SelfButton, event: Gdk.Event) => item.activate(event),
    //                 on_secondary_click: (_, event) => item.openMenu(event),
    //                 onMiddleClick: () => Notify({ summary: 'App Name', body: item.id }),
    //                 tooltip_markup: item.bind('tooltip_markup'),
    //             });
    //         });
    //     },
    // );

    return {
        component: new Widget.Box({
            className: 'systray-container',
            // children: items,
            children: [],
        }),
        isVisible: true,
        boxClass: 'systray',
        isVis,
        props: {},
    };
};

export { SysTray };
