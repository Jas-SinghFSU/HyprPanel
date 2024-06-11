const hyprland = await Service.import("hyprland");
const audio = await Service.import("audio");

import { globalMousePos } from "../../../globals.js";

const Volume = () => {
  const icons = {
    101: "󰕾",
    66: "󰕾",
    34: "󰖀",
    1: "󰕿",
    0: "󰝟",
  };

  const getIcon = () => {
    const icon = audio.speaker.is_muted
      ? 0
      : [101, 66, 34, 1, 0].find(
          (threshold) => threshold <= audio.speaker.volume * 100,
        );

    return icons[icon];
  };

  const volIcn = Widget.Label({
    label: audio.speaker.bind("volume").as(() => getIcon()),
    class_name: "bar-volume_icon",
  });

  const volPct = Widget.Label({
    label: audio.speaker.bind("volume").as((v) => ` ${Math.floor(v * 100)}%`),
    class_name: "bar-volume_percentage",
  });

  return {
    component: Widget.Box({
      class_name: "volume",
      children: [volIcn, volPct],
    }),
    isVisible: true,
    props: {
    on_primary_click: (a, b, c, d) => {
      const monX = hyprland.monitors[hyprland.active.monitor.id].x;
      const monY = hyprland.monitors[hyprland.active.monitor.id].y;

      const cursorPos = Utils.exec("hyprctl cursorpos").split(", ").map(Number);
      cursorPos[0] = cursorPos[0] - monX;
      cursorPos[1] = cursorPos[1] - monY;
      globalMousePos.value = cursorPos;
      App.toggleWindow("audiomenu");
    },
    },
  };
};

export { Volume };
