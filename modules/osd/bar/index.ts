import { OSDOrientation } from "lib/types/options";
import brightness from "services/Brightness"
const audio = await Service.import("audio")

export const OSDBar = (ort: OSDOrientation) => {
    return Widget.Box({
        class_name: "osd-bar-container",
        children: [
            Widget.LevelBar({
                class_name: "osd-bar",
                vertical: ort === "vertical",
                inverted: ort === "vertical",
                bar_mode: "continuous",
                setup: self => {
                    self.hook(brightness, () => {
                        self.value = brightness.screen;
                    }, "notify::screen")
                    self.hook(brightness, () => {
                        self.value = brightness.kbd;
                    }, "notify::kbd")
                    self.hook(audio, () => {
                        self.toggleClassName("overflow", audio.speaker.volume > 1)
                        self.value = audio.speaker.volume <= 1 ? audio.speaker.volume : audio.speaker.volume - 1;
                    })
                }
            })
        ]
    });
}
