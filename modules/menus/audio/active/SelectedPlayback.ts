const audio = await Service.import("audio");
import { getIcon } from "../utils.js";

const renderActivePlayback = () => {
  return [
    Widget.Box({
      class_name: "menu-slider-container playback",
      children: [
        Widget.Button({
          vexpand: false,
          vpack: "end",
          setup: (self) => {
            self.hook(audio, () => {
              const spkr = audio.speaker;
              const className = `menu-active-button playback ${spkr.is_muted ? "muted" : ""}`;
              return (self.class_name = className);
            });
          },
          on_primary_click: () =>
            (audio.speaker.is_muted = !audio.speaker.is_muted),
          child: Widget.Icon({
            class_name: "menu-active-icon playback",
            setup: (self) => {
              self.hook(audio, () => {
                self.icon = getIcon(
                  audio.speaker.volume,
                  audio.speaker.is_muted,
                )["spkr"];
              });
            },
          }),
        }),
        Widget.Box({
          vertical: true,
          children: [
            Widget.Label({
              class_name: "menu-active playback",
              hpack: "start",
              truncate: "end",
              expand: true,
              wrap: true,
              label: audio.bind("speaker").as((v) => v.description || ""),
            }),
            Widget.Slider({
              value: audio["speaker"].bind("volume"),
              class_name: "menu-active-slider menu-slider playback",
              draw_value: false,
              hexpand: true,
              min: 0,
              max: 1,
              onChange: ({ value }) => (audio.speaker.volume = value),
            }),
          ],
        }),
        Widget.Label({
          vpack: "end",
          class_name: "menu-active-percentage playback",
          label: audio.speaker
            .bind("volume")
            .as((v) => `${Math.floor(v * 100)}%`),
        }),
      ],
    }),
  ];
};

export { renderActivePlayback };
