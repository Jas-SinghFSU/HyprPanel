import { OSDOrientation } from "lib/types/options";
import brightness from "services/Brightness"
const audio = await Service.import("audio")

export const OSDIcon = (ort: OSDOrientation) => {
    return Widget.Box({
        class_name: "osd-icon-container",
        hexpand: true,
        child: Widget.Label({
            class_name: "osd-icon",
            hexpand: true,
            vexpand: true,
            hpack: "center",
            vpack: "center",
            setup: self => {
                self.hook(brightness, () => {
                    self.label = "󱍖";
                }, "notify::screen")
                self.hook(brightness, () => {
                    self.label = "󰥻";
                }, "notify::kbd")
                self.hook(audio.microphone, () => {
                    self.label = audio.microphone.is_muted ? "󰍭" : "󰍬";
                }, "notify::volume")
                self.hook(audio.microphone, () => {
                    self.label = audio.microphone.is_muted ? "󰍭" : "󰍬";
                }, "notify::is-muted")
                self.hook(audio.speaker, () => {
                    self.label = audio.speaker.is_muted ? "󰝟" : "󰕾";
                }, "notify::volume")
                self.hook(audio.speaker, () => {
                    self.label = audio.speaker.is_muted ? "󰝟" : "󰕾";
                }, "notify::is-muted")
            }
        })
    });
}
