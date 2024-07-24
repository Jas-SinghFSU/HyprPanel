import { BarGeneral } from "./general/index";
import { BarSettings } from "./bar/index";
import { ClockMenuSettings } from "./menus/clock";
import { DashboardMenuSettings } from "./menus/dashboard";

type Page = "General" | "Bar" | "Clock Menu" | "Dashboard Menu"
const CurrentPage = Variable<Page>("General");

const pagerMap: Page[] = [
    "General",
    "Bar",
    "Clock Menu",
    "Dashboard Menu",
]

export const SettingsMenu = () => {
    return Widget.Box({
        vertical: true,
        children: CurrentPage.bind("value").as(v => {
            return [
                Widget.Box({
                    class_name: "option-pages-container",
                    hpack: "center",
                    hexpand: true,
                    children: pagerMap.map((page) => {
                        return Widget.Button({
                            hpack: "center",
                            class_name: `pager-button ${v === page ? 'active' : ''}`,
                            label: page,
                            on_primary_click: () => CurrentPage.value = page
                        })
                    })
                }),
                Widget.Stack({
                    vexpand: true,
                    class_name: "themes-menu-stack",
                    children: {
                        "General": BarGeneral(),
                        "Bar": BarSettings(),
                        "Clock Menu": ClockMenuSettings(),
                        "Dashboard Menu": DashboardMenuSettings(),
                    },
                    shown: CurrentPage.bind("value")
                })
            ]
        })
    })
}
