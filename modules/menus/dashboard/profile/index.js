const Profile = () => {
  return Widget.Box({
    class_name: "profiles-container",
    children: [
      Widget.Box({
        class_name: "profile-picture-container",
        children: [
          Widget.Icon({
            class_name: "profile-picture",
          }),
          Widget.Box({
            class_name: "profile-name",
          }),
        ],
      }),
      Widget.Box({
        class_name: "power-menu-container",
        children: [
          Widget.Button({
            class_name: "dashboard-button shutdown",
          }),
          Widget.Button({
            class_name: "dashboard-button restart",
          }),
          Widget.Button({
            class_name: "dashboard-button lock",
          }),
          Widget.Button({
            class_name: "dashboard-button sleep",
          }),
        ],
      }),
    ],
  });
};

export { Profile };
