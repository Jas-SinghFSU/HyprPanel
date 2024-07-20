import GLib from "gi://GLib";
import { openMenu } from "../utils.js";
import options from "options";
const { format } = options.bar.clock;

const date = Variable(GLib.DateTime.new_now_local(), {
  poll: [1000, () => GLib.DateTime.new_now_local()],
});
const time = Utils.derive([date, format], (c, f) => c.format(f) || "");

const Clock = () => {
  return {
    component: Widget.Label({
      class_name: "clock",
      label: time.bind(),
    }),
    isVisible: true,
    boxClass: "clock",
    props: {
      on_primary_click: (clicked, event) => {
        openMenu(clicked, event, "calendarmenu");
      },
    },
  };
};

export { Clock };
