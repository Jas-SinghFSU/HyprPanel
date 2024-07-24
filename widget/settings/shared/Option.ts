import { Label } from "./Label";
import { Inputter } from "./Inputter";
import icons from "lib/icons";

export const Option = (props, className = '') => {
    return Widget.Box({
        class_name: "option-item",
        hexpand: true,
        children: [
            Widget.Box({
                hpack: "start",
                vpack: "center",
                hexpand: true,
                child: Label(props.title, props.subtitle || ""),
            }),
            Inputter(props, className),
            Widget.Button({
                vpack: "center",
                class_name: "reset",
                child: Widget.Icon(icons.ui.refresh),
                on_clicked: () => props.opt.reset(),
                sensitive: props.opt.bind().as(v => v !== props.opt.initial),
            }),
        ]
    })
}
