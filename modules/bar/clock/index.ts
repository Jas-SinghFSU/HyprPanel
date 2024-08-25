import Gdk from 'gi://Gdk?version=3.0';
import GLib from "gi://GLib";
import { openMenu } from "../utils.js";
import options from "options";
const { format, icon, showIcon, showTime } = options.bar.clock;
const { style } = options.theme.bar.buttons;


const date = Variable(GLib.DateTime.new_now_local(), {
    poll: [1000, () => GLib.DateTime.new_now_local()],
});
const time = Utils.derive([date, format], (c, f) => c.format(f) || "");

const Clock = () => {

    const clockTime = Widget.Label({
        class_name: "bar-button-label clock bar",
        label: time.bind(),
    });

    const clockIcon = Widget.Label({
        label: icon.bind("value"),
        class_name: "bar-button-icon clock txt-icon bar",
    });

    return {
        component: Widget.Box({
            className: Utils.merge([
                style.bind("value"),
                showIcon.bind("value"), showTime.bind("value")
            ], (btnStyle, shwIcn, shwLbl) => {
                const styleMap = {
                    default: "style1",
                    split: "style2",
                    wave: "style3",
                };

                return `bluetooth ${styleMap[btnStyle]} ${!shwLbl ? "no-label" : ""} ${!shwIcn ? "no-icon" : ""}`;
            }),
            children: Utils.merge([showIcon.bind("value"), showTime.bind("value")], (shIcn, shTm) => {

                if (shIcn && !shTm) {
                    return [clockIcon];
                } else if (shTm && !shIcn) {
                    return [clockTime];
                }

                return [clockIcon, clockTime];
            })
        }),
        isVisible: true,
        boxClass: "clock",
        props: {
            on_primary_click: (clicked: any, event: Gdk.Event) => {
                openMenu(clicked, event, "calendarmenu");
            },
        },
    };
};

export { Clock };
