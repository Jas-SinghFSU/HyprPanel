const bluetooth = await Service.import("bluetooth");
import { label } from "./label.js";
import { devices } from "./devicelist.js";

const Devices = () => {
  return Widget.Box({
    class_name: "menu-section-container",
    vertical: true,
    children: [
      label(bluetooth),
      Widget.Box({
        class_name: "menu-items-section",
        // hscroll: 'never',
        // vscroll: 'always',
        child: Widget.Box({
          class_name: "menu-content",
          vertical: true,
          setup: (self) => {
            devices(bluetooth, self);
          },
        }),
      }),
    ],
  });
};

export { Devices };
