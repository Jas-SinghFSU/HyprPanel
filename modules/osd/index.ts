import { OSDAnchor } from "lib/types/options";
import brightness from "services/Brightness"
import options from "options";
const hyprland = await Service.import("hyprland");
const audio = await Service.import("audio")

const {
    location,
    active_monitor,
    monitor
} = options.theme.osd;

const curMonitor = Variable(0);

hyprland.active.connect("changed", () => {
    curMonitor.value = hyprland.active.monitor.id;
})

const DELAY = 3000

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
    return Widget.Revealer({
        transition: "crossfade",
        reveal_child: false,
        setup: self => {
            self.hook(audio.speaker, () => {
                self.reveal_child = true
                count++
                Utils.timeout(DELAY, () => {
                    count--

                    if (count === 0)
                        self.reveal_child = false
                })
            })
            self.hook(brightness, () => {
                self.reveal_child = true
                count++
                Utils.timeout(DELAY, () => {
                    count--

                    if (count === 0)
                        self.reveal_child = false
                })
            }, "notify::screen")
            self.hook(brightness, () => {
                self.reveal_child = true
                count++
                Utils.timeout(DELAY, () => {
                    count--

                    if (count === 0)
                        self.reveal_child = false
                })
            }, "notify::kbd")

        },
        child: Widget.Box({
            class_name: "osd-container",
            vertical: true,
            children: [
                Widget.Box({
                    class_name: "osd-label-container",
                    hexpand: true,
                    child: Widget.Label({
                        class_name: "osd-label",
                        hexpand: true,
                        hpack: "center",
                        setup: self => {
                            self.hook(audio, () => {
                                self.toggleClassName("overflow", audio.speaker.volume > 1)
                                self.label = `${Math.floor(audio.speaker.volume * 100)}`;
                            })
                            self.hook(brightness, () => {
                                self.label = `${Math.floor(brightness.screen * 100)}`;
                            }, "notify::screen")
                            self.hook(brightness, () => {
                                self.label = `${Math.floor(brightness.kbd * 100)}`;
                            }, "notify::kbd")
                        }
                    })
                }),
                Widget.Box({
                    class_name: "osd-bar-container",
                    children: [
                        Widget.LevelBar({
                            class_name: "osd-bar",
                            vertical: true,
                            inverted: true,
                            bar_mode: "continuous",
                            setup: self => {
                                self.hook(audio, () => {
                                    self.toggleClassName("overflow", audio.speaker.volume > 1)
                                    self.value = audio.speaker.volume <= 1 ? audio.speaker.volume : audio.speaker.volume - 1;
                                })
                                self.hook(brightness, () => {
                                    self.value = brightness.screen;
                                }, "notify::screen")
                                self.hook(brightness, () => {
                                    self.value = brightness.kbd;
                                }, "notify::kbd")
                            }
                        })
                    ]
                }),
                Widget.Box({
                    class_name: "osd-icon-container",
                    hexpand: true,
                    child: Widget.Label({
                        class_name: "osd-icon",
                        hexpand: true,
                        hpack: "center",
                        setup: self => {
                            self.hook(audio, () => {
                                self.label = audio.speaker.is_muted ? "󰝟" : "󰕾";
                            })
                            self.hook(brightness, () => {
                                self.label = "󱍖";
                            }, "notify::screen")
                            self.hook(brightness, () => {
                                self.label = "󰥻";
                            }, "notify::kbd")
                        }
                    })
                })
            ]
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
    class_name: "indicator",
    layer: "overlay",
    anchor: location.bind("value").as(v => getPosition(v)),
    click_through: true,
    child: Widget.Box({
        css: "padding: 1px;",
        expand: true,
        child: renderOSD(),
    }),
})
