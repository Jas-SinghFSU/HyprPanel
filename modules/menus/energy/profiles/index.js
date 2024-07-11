const powerProfiles = await Service.import("powerprofiles");
import icons from "../../../icons/index.js";

const EnergyProfiles = () => {
  return Widget.Box({
    class_name: "menu-section-container energy",
    vertical: true,
    children: [
      Widget.Box({
        class_name: "menu-label-container",
        hpack: "fill",
        child: Widget.Label({
          class_name: "menu-label",
          hexpand: true,
          hpack: "start",
          label: "Power Profile",
        }),
      }),
      Widget.Box({
        class_name: "menu-items-section",
        vpack: "fill",
        vexpand: true,
        vertical: true,
        children: powerProfiles.bind("profiles").as((profiles) => {
          return profiles.map((prof) => {
            const ProfileLabels = {
              "power-saver": "Power Saver",
              balanced: "Balanced",
              performance: "Performance",
            };
            return Widget.Button({
              on_primary_click: () => {
                powerProfiles.active_profile = prof.Profile;
              },
              class_name: powerProfiles.bind("active_profile").as((active) => {
                return `power-profile-item ${active === prof.Profile ? "active" : ""}`;
              }),
              child: Widget.Box({
                children: [
                  Widget.Icon({
                    class_name: "power-profile-icon",
                    icon: icons.powerprofile[prof.Profile],
                  }),
                  Widget.Label({
                    class_name: "power-profile-label",
                    label: ProfileLabels[prof.Profile],
                  }),
                ],
              }),
            });
          });
        }),
      }),
    ],
  });
};

export { EnergyProfiles };
