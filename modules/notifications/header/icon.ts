import icons from "../../icons/index.js";

const NotificationIcon = ({ app_entry, app_icon, app_name }) => {
  let icon = icons.fallback.notification;

  if (
    Utils.lookUpIcon(app_name) ||
    Utils.lookUpIcon(app_name.toLowerCase() || "")
  )
    icon = Utils.lookUpIcon(app_name)
      ? app_name
      : Utils.lookUpIcon(app_name.toLowerCase())
        ? app_name.toLowerCase()
        : "";

  if (Utils.lookUpIcon(app_icon) && icon === "") icon = app_icon;

  if (Utils.lookUpIcon(app_entry || "") && icon === "") icon = app_entry || "";

  return Widget.Box({
    css: `
            min-width: 2rem;
            min-height: 2rem;
        `,
    child: Widget.Icon({
      class_name: "notification-icon",
      icon,
    }),
  });
};

export { NotificationIcon };
