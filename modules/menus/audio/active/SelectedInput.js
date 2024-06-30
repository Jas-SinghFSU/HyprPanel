const audio = await Service.import("audio");
import { getIcon } from '../utils.js';

const renderActiveInput = () => {
  return [
    Widget.Box({
      class_name: "menu-slider-container input",
      children: [
        Widget.Button({
          vexpand: false,
          vpack: "end",
          setup: (self) => {
            self.hook(audio, () => {
              const mic = audio.microphone;
              const className = `menu-active-button input ${mic.is_muted ? "muted" : ""}`;
              return (self.class_name = className);
            });
          },
          on_primary_click: () =>
            (audio.microphone.is_muted = !audio.microphone.is_muted),
          child: Widget.Icon({
            class_name: "menu-active-icon input",
            setup: (self) => {
              self.hook(audio, () => {
                self.icon = getIcon(
                  audio.microphone.volume,
                  audio.microphone.is_muted,
                )["mic"];
              });
            },
          }),
        }),
        Widget.Box({
          vertical: true,
          children: [
            Widget.Label({
              class_name: "menu-active input",
              hpack: "start",
              truncate: "end",
              wrap: true,
              label: audio.bind("microphone").as((v) => v.description || ""),
            }),
            Widget.Slider({
              value: audio.microphone.bind("volume").as((v) => v),
              class_name: "menu-active-slider menu-slider inputs",
              draw_value: false,
              hexpand: true,
              min: 0,
              max: 1,
              onChange: ({ value }) => (audio.microphone.volume = value),
            }),
          ],
        }),
        Widget.Label({
          class_name: "menu-active-percentage input",
          vpack: "end",
          label: audio.microphone
            .bind("volume")
            .as((v) => `${Math.floor(v * 100)}%`),
        }),
      ],
    }),
  ];
};

export { renderActiveInput };
