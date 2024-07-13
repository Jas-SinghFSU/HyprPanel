import { notifHasImg } from "../../utils.js";

const Image = (notif) => {
  if (notifHasImg(notif)) {
    return Widget.Box({
      class_name: "notification-card-image-container menu",
      hpack: "center",
      vpack: "center",
      vexpand: false,
      child: Widget.Box({
        hpack: "center",
        vexpand: false,
        class_name: "notification-card-image menu",
        css: `background-image: url("${notif.image}")`,
      }),
    });
  }

  return Widget.Box();
};

export { Image };
