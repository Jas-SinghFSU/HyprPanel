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
    label: getIcon(),
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
      on_primary_click: (_, event) => {
        const clickPos = event.get_root_coords();
        const coords = [clickPos[1], clickPos[2]];

        globalMousePos.value = coords;

        App.toggleWindow("audiomenu");
      },
    },
  };
};

export { Volume };
