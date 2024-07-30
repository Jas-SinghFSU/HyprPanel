import { OSDAnchor } from "lib/types/options";
import options from "options";
import brightness from "services/Brightness"
import { OSDLabel } from "./label/index";
import { OSDBar } from "./bar/index";
import { OSDIcon } from "./icon/index";
const hyprland = await Service.import("hyprland");
const audio = await Service.import("audio")

const {
    enable,
    orientation,
    location,
    active_monitor,
    monitor
} = options.theme.osd;

const curMonitor = Variable(monitor.value);

hyprland.active.connect("changed", () => {
    curMonitor.value = hyprland.active.monitor.id;
})

const DELAY = 2500;

const getPosition = (pos: OSDAnchor): ("top" | "bottom" | "left" | "right")[] => {
    const positionMap: { [key: string]: ("top" | "bottom" | "left" | "right")[] } = {
        "top": ["top"],
        "top right": ["top", "right"],
        "top left": ["top", "left"],
        "bottom": ["bottom"],
        "bottom right": ["bottom", "right"],
        "bottom left": ["bottom", "left"],
        "right": ["right"],
        "left": ["left"],
    };

    return positionMap[pos];
}
const renderOSD = () => {
    let count = 0

    const handleReveal = (self: any) => {
        self.reveal_child = true
        count++
        Utils.timeout(DELAY, () => {
            count--

            if (count === 0)
                self.reveal_child = false
        })
    }

    return Widget.Revealer({
        transition: "crossfade",
        reveal_child: false,
        setup: self => {
            self.hook(brightness, () => {
                handleReveal(self);
            }, "notify::screen")
            self.hook(brightness, () => {
                handleReveal(self);
            }, "notify::kbd")
            self.hook(audio.speaker, () => {
                handleReveal(self);
            })

        },
        child: Widget.Box({
            class_name: "osd-container",
            vertical: orientation.bind("value").as(ort => ort === "vertical"),
            children: orientation.bind("value").as(ort => {
                if (ort === "vertical") {
                    return [
                        OSDLabel(ort),
                        OSDBar(ort),
                        OSDIcon(ort)
                    ]
                }

                return [
                    OSDIcon(ort),
                    OSDBar(ort),
                    OSDLabel(ort),
                ]
            })
        })
    })
}

export default () => Widget.Window({
    monitor: Utils.merge([
        curMonitor.bind("value"),
        monitor.bind("value"),
        active_monitor.bind("value")], (curMon, mon, activeMonitor) => {
            if (activeMonitor === true) {
                return curMon;
            }

            return mon;
        }),
    name: `indicator`,
    visible: enable.bind("value"),
    class_name: "indicator",
    layer: "overlay",
    anchor: location.bind("value").as(v => getPosition(v)),
    click_through: true,
    child: Widget.Overlay({
        passThrough: true,
        css: "padding: 1px;",
        expand: true,
        child: renderOSD(),
    }),
})
