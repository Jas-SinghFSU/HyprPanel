import icons from "../../../icons/index.js";
import powermenu from "../../power/helpers/actions.js";

import options from "options";
const { image, name } = options.menus.dashboard.powermenu.avatar;

const Profile = () => {
  const handleClick = (action) => {
    App.closeWindow("dashboardmenu");
    return powermenu.action(action);
  };

  return Widget.Box({
    class_name: "profiles-container",
    hpack: "fill",
    hexpand: true,
    children: [
      Widget.Box({
        class_name: "profile-picture-container dashboard-card",
        hexpand: true,
        vertical: true,
        children: [
          Widget.Icon({
            hpack: "center",
            class_name: "profile-picture",
            icon: image.bind("value"),
          }),
          Widget.Label({
            hpack: "center",
            class_name: "profile-name",
            label: name.bind("value").as((v) => {
              if (v === "system") {
                return Utils.exec("bash -c whoami");
              }
              return v;
            }),
          }),
        ],
      }),
      Widget.Box({
        class_name: "power-menu-container dashboard-card",
        vertical: true,
        vexpand: true,
        children: [
          Widget.Button({
            class_name: "dashboard-button shutdown",
            on_clicked: () => handleClick("shutdown"),
            tooltip_text: "Shut Down",
            vexpand: true,
            child: Widget.Icon(icons.powermenu.shutdown),
          }),
          Widget.Button({
            class_name: "dashboard-button restart",
            on_clicked: () => handleClick("reboot"),
            tooltip_text: "Restart",
            vexpand: true,
            child: Widget.Icon(icons.powermenu.reboot),
          }),
          Widget.Button({
            class_name: "dashboard-button lock",
            on_clicked: () => handleClick("logout"),
            tooltip_text: "Log Out",
            vexpand: true,
            child: Widget.Icon(icons.powermenu.logout),
          }),
          Widget.Button({
            class_name: "dashboard-button sleep",
            on_clicked: () => handleClick("sleep"),
            tooltip_text: "Sleep",
            vexpand: true,
            child: Widget.Icon(icons.powermenu.sleep),
          }),
        ],
      }),
    ],
  });
};

export { Profile };
