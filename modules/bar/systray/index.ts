import Gdk from 'gi://Gdk?version=3.0';
const systemtray = await Service.import("systemtray");
import options from "options";

const { ignore } = options.bar.systray;

const SysTray = () => {
    const isVis = Variable(false);

    const items = Utils.merge(
        [systemtray.bind("items"), ignore.bind("value")],
        (items, ignored) => {
            const filteredTray = items.filter(({ id }) => !ignored.includes(id));

            isVis.value = filteredTray.length > 0;

            return filteredTray.map((item) => {
                if (item.menu !== undefined) {
                    item.menu["class_name"] = "systray-menu";
                }

                return Widget.Button({
                    cursor: "pointer",
                    child: Widget.Icon({
                        class_name: "systray-icon",
                        icon: item.bind("icon"),
                    }),
                    on_primary_click: (_: any, event: Gdk.Event) => item.activate(event),
                    on_secondary_click: (_, event) => item.openMenu(event),
                    tooltip_markup: item.bind("tooltip_markup"),
                });
            });
        },
    );

    return {
        component: Widget.Box({
            class_name: "systray",
            children: items,
        }),
        isVisible: true,
        boxClass: "systray",
        isVis,
        props: {}
    };
};

export { SysTray };
