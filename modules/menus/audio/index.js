const audio = await Service.import("audio");
import DropdownMenu from "../DropdownMenu.js";
import { renderInputDevices } from "./InputDevices.js";
import { renderPlaybacks } from "./PlaybackDevices.js";
import { renderActiveInput } from "./SelectedInput.js";
import { renderActivePlayback } from "./SelectedPlayback.js";

export default () => {
  return DropdownMenu({
    name: "audiomenu",
    transition: "crossfade",
    child: Widget.Box({
      class_name: "menu-items",
      hpack: "fill",
      hexpand: true,
      child: Widget.Box({
        vertical: true,
        hpack: "fill",
        hexpand: true,
        class_name: "menu-items-container",
        children: [
          Widget.Box({
            class_name: "menu-section-container volume",
            vertical: true,
            children: [
              Widget.Box({
                class_name: "menu-label-container volume",
                hpack: "fill",
                child: Widget.Label({
                  class_name: "menu-label audio volume",
                  hexpand: true,
                  hpack: "center",
                  label: "Volume",
                }),
              }),
              Widget.Box({
                class_name: "menu-items-section selected",
                vertical: true,
                children: [
                  Widget.Box({
                    class_name: "menu-active-container playback",
                    vertical: true,
                    children: renderActivePlayback(),
                  }),
                  Widget.Box({
                    class_name: "menu-active-container input",
                    vertical: true,
                    children: renderActiveInput(),
                  }),
                ],
              }),
            ],
          }),
          Widget.Box({
            class_name: "menu-section-container playback",
            vertical: true,
            children: [
              Widget.Box({
                class_name: "menu-label-container playback",
                hpack: "fill",
                child: Widget.Label({
                  class_name: "menu-label audio playback",
                  hexpand: true,
                  hpack: "center",
                  label: "Playback Devices",
                }),
              }),
              Widget.Box({
                class_name: "menu-items-section playback",
                vertical: true,
                children: [
                  Widget.Box({
                    class_name: "menu-container playback",
                    vertical: true,
                    children: [
                      Widget.Box({
                        vertical: true,
                        children: audio
                          .bind("speakers")
                          .as((v) => renderPlaybacks(v)),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          Widget.Box({
            class_name: "menu-section-container input",
            vertical: true,
            children: [
              Widget.Box({
                class_name: "menu-label-container playback",
                hpack: "fill",
                child: Widget.Label({
                  class_name: "menu-label audio playback",
                  hexpand: true,
                  hpack: "center",
                  label: "Input Devices",
                }),
              }),
              Widget.Box({
                class_name: "menu-items-section input",
                vertical: true,
                children: [
                  Widget.Box({
                    class_name: "menu-container input",
                    vertical: true,
                    children: [
                      Widget.Box({
                        vertical: true,
                        children: audio
                          .bind("microphones")
                          .as((v) => renderInputDevices(v)),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    }),
  });
};
