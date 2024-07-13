import { notifHasImg } from "../../menus/notifications/utils.js";

const Image = (notif) => {
  if (notifHasImg(notif)) {
    return Widget.Box({
      class_name: "notification-card-image-container",
      hpack: "center",
      vpack: "center",
      vexpand: false,
      child: Widget.Box({
        hpack: "center",
        vexpand: false,
        class_name: "notification-card-image",
        css: `background-image: url("${notif.image}")`,
      }),
    });
  }

  return Widget.Box();
};

export { Image };
