import RegularWindow from "widget/RegularWindow"
import icons from "lib/icons"
import options from "options"
import { BarTheme } from "./pages/theme/bar/index"
const Header = () => Widget.CenterBox({
    class_name: "header",
    start_widget: Widget.Button({
        class_name: "reset",
        on_clicked: options.reset,
        hpack: "start",
        vpack: "start",
        child: Widget.Icon(icons.ui.refresh),
        tooltip_text: "Reset",
    }),
    center_widget: Widget.Box({

    }),
    end_widget: Widget.Button({
        class_name: "close",
        hpack: "end",
        vpack: "start",
        child: Widget.Icon(icons.ui.close),
        on_clicked: () => App.closeWindow("settings-dialog"),
    }),
})

export default () => RegularWindow({
    name: "settings-dialog",
    class_name: "settings-dialog",
    title: "Settings",
    setup(win) {
        win.on("delete-event", () => {
            win.hide()
            return true
        })
        win.set_default_size(500, 600)
    },
    child: Widget.Box({
        vertical: true,
        children: [
            Header(),
            BarTheme()
        ],
    }),
})
