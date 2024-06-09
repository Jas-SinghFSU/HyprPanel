const notifications = await Service.import("notifications");

// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
const Notification = () => {
  const popups = notifications.bind("popups");
  return {
    component: Widget.Box({
      class_name: "notification",
      visible: popups.as((p) => p.length > 0),
      children: [
        Widget.Icon({
          icon: "preferences-system-notifications-symbolic",
        }),
        Widget.Label({
          label: popups.as((p) => p[0]?.summary || ""),
        }),
      ],
    }),
    isVisible: false,
  };
};

export { Notification };
