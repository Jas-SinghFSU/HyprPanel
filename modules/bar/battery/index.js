const battery = await Service.import("battery");
import { openMenu } from "../utils.js";
import options from "options";

const { label: show_label } = options.bar.battery;

const BatteryLabel = () => {
  const isVis = Variable(battery.available);

  const icon = () =>
    battery
      .bind("percent")
      .as((p) => `battery-level-${Math.floor(p / 10) * 10}-symbolic`);

  battery.connect("changed", ({ available }) => {
    isVis.value = available;
  });

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  const generateTooltip = (timeSeconds, isCharging, isCharged) => {
    if (isCharged) {
      return "Fully Charged!!!";
    }

    const { hours, minutes } = formatTime(timeSeconds);
    if (isCharging) {
      return `${hours} hours ${minutes} minutes until full`;
    } else {
      return `${hours} hours ${minutes} minutes left`;
    }
  };

  return {
    component: Widget.Box({
      class_name: "battery",
      visible: battery.bind("available"),
      tooltip_text: battery.bind("time_remaining").as((t) => t.toString()),
      children: Utils.merge(
        [battery.bind("available"), show_label.bind("value")],
        (batAvail, showLabel) => {
          if (batAvail && showLabel) {
            return [
              Widget.Icon({ icon: icon() }),
              Widget.Label({
                label: battery.bind("percent").as((p) => ` ${p}%`),
              }),
            ];
          } else if (batAvail && !showLabel) {
            return [Widget.Icon({ icon: icon() })];
          } else {
            return [];
          }
        },
      ),
      setup: (self) => {
        self.hook(battery, () => {
          if (battery.available) {
            self.tooltip_text = generateTooltip(
              battery.time_remaining,
              battery.charging,
              battery.charged,
            );
          }
        });
      },
    }),
    isVis,
    boxClass: "battery",
    props: {
      on_primary_click: (clicked, event) => {
        openMenu(clicked, event, "energymenu");
      },
    },
  };
};

export { BatteryLabel };
