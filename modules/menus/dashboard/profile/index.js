import icons from '../../../icons/index.js';

const Profile = () => {
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
            icon: `${App.configDir}/assets/21210205.png`
          }),
          Widget.Label({
            hpack: "center",
            class_name: "profile-name",
            label: "Jaskir Linux"
          })
        ],
      }),
      Widget.Box({
        class_name: "power-menu-container dashboard-card",
        vertical: true,
        vexpand: true,
        children: [
          Widget.Button({
            class_name: "dashboard-button shutdown",
            tooltip_text: "Shut Down",
            vexpand: true,
            child: Widget.Icon(icons.powermenu.shutdown)
          }),
          Widget.Button({
            class_name: "dashboard-button restart",
            tooltip_text: "Restart",
            vexpand: true,
            child: Widget.Icon(icons.powermenu.reboot)
          }),
          Widget.Button({
            class_name: "dashboard-button lock",
            tooltip_text: "Log Out",
            vexpand: true,
            child: Widget.Icon(icons.powermenu.logout)
          }),
          Widget.Button({
            class_name: "dashboard-button sleep",
            tooltip_text: "Sleep",
            vexpand: true,
            child: Widget.Icon(icons.powermenu.sleep)
          }),
        ],
      }),
    ],
  });
};

export { Profile };
