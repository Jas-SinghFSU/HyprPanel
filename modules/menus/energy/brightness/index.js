import brightness from "../../../../services/Brightness.js";
import icons from "../../../icons/index.js";

const Brightness = () => {
  return Widget.Box({
    class_name: "menu-section-container brightness",
    vertical: true,
    children: [
      Widget.Box({
        class_name: "menu-label-container",
        hpack: "fill",
        child: Widget.Label({
          class_name: "menu-label",
          hexpand: true,
          hpack: "start",
          label: "Brightness",
        }),
      }),
      Widget.Box({
        class_name: "menu-items-section",
        vpack: "fill",
        vexpand: true,
        vertical: true,
        child: Widget.Box({
          class_name: "brightness-container",
          children: [
            Widget.Icon({
              class_name: "brightness-slider-icon",
              icon: icons.brightness.screen,
            }),
            Widget.Slider({
              value: brightness.bind("screen_value"),
              class_name: "menu-active-slider menu-slider brightness",
              draw_value: false,
              hexpand: true,
              min: 0,
              max: 1,
              onChange: ({ value }) => (brightness.screen_value = value),
            }),
            Widget.Label({
              class_name: "brightness-slider-label",
              label: brightness
                .bind("screen_value")
                .as((b) => `${Math.floor(b * 100)}%`),
            }),
          ],
        }),
      }),
    ],
  });
};

export { Brightness };
