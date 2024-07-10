const media = await Service.import("mpris");
import { MediaInfo } from "./components/mediainfo.js";
import { Controls } from "./components/controls.js";
import { Bar } from "./components/bar.js";

const Media = () => {
  const curPlayer = Variable("");

  media.connect("changed", () => {
    const statusOrder = {
      Playing: 1,
      Paused: 2,
      Stopped: 3,
    };

    const isPlaying = media.players.find(
      (p) => p["play-back-status"] === "Playing",
    );

    if (isPlaying) {
      curPlayer.value = media.players.sort(
        (a, b) =>
          statusOrder[a["play-back-status"]] -
          statusOrder[b["play-back-status"]],
      )[0].name;
    }
  });

  const getPlayerInfo = () => {
    return media.players.find((p) => p.name === curPlayer.value);
  };

  return Widget.Box({
    class_name: "menu-section-container",
    children: [
      Widget.Box({
        class_name: "menu-items-section",
        vertical: false,
        child: Widget.Box({
          class_name: "menu-content",
          children: [
            Widget.Box({
              class_name: "media-content",
              child: Widget.Box({
                class_name: "media-indicator-right-section",
                hpack: "fill",
                hexpand: true,
                vertical: true,
                children: [
                  MediaInfo(getPlayerInfo),
                  Controls(getPlayerInfo),
                  Bar(getPlayerInfo),
                ],
              }),
            }),
          ],
          setup: (self) => {
            self.hook(media, () => {
              const curPlayer = getPlayerInfo();
              if (curPlayer !== undefined) {
                self.css = `background-image: linear-gradient(
                  rgba(30, 30, 46, 0.85),
                  rgba(30, 30, 46, 0.9),
                  #1e1e2e 40em), url("${curPlayer.track_cover_url}");
                   `;
              }
            });
          },
        }),
      }),
    ],
  });
};

export { Media };
