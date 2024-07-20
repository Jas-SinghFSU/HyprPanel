const audio = await Service.import("audio");
import { openMenu } from "../utils.js";
import options from "options";

import { globalMousePos } from "globals.js";

const Volume = () => {
  const icons = {
    101: "󰕾",
    66: "󰕾",
    34: "󰖀",
    1: "󰕿",
    0: "󰝟",
  };

  const getIcon = () => {
    const icon = Utils.merge(
      [audio.speaker.bind("is_muted"), audio.speaker.bind("volume")],
      (isMuted, vol) => {
        return isMuted
          ? 0
          : [101, 66, 34, 1, 0].find((threshold) => threshold <= vol * 100);
      },
    );

    return icon.as((i) => icons[i]);
  };

  const volIcn = Widget.Label({
    vpack: "center",
    label: getIcon(),
    class_name: "bar-volume_icon",
  });

  const volPct = Widget.Label({
    vpack: "center",
    label: audio.speaker.bind("volume").as((v) => `  ${Math.floor(v * 100)}%`),
    class_name: "bar-volume_percentage",
  });

  return {
    component: Widget.Box({
      vpack: "center",
      class_name: "volume",
      children: options.bar.volume.label.bind("value").as((showLabel) => {
        if (showLabel) {
          return [volIcn, volPct];
        }
        return [volIcn];
      }),
    }),
    isVisible: true,
    boxClass: "volume",
    props: {
      on_primary_click: (clicked, event) => {
        openMenu(clicked, event, "audiomenu");
      },
    },
  };
};

export { Volume };
