const media = await Service.import("mpris");
import { AlbumCover } from "./components/albumcover.js";
import { MediaInfo } from "./components/mediainfo.js";
import { Controls } from "./components/controls.js";
import { Bar } from "./components/bar.js";

const Media = () => {
  return Widget.Box({
    class_name: "menu-section-container",
    children: [
      Widget.Box({
        class_name: "menu-items-section",
        vertical: false,
        child: Widget.Box({
          class_name: "menu-content",
          setup: (self) => {
            let curPlayer = media.players[0];
            self.hook(media, () => {
              const statusOrder = {
                Playing: 1,
                Paused: 2,
                Stopped: 3,
              };

              const isPlaying = media.players.find(
                (p) => p["play-back-status"] === "Playing",
              );

              if (isPlaying) {
                curPlayer = media.players.sort(
                  (a, b) =>
                    statusOrder[a["play-back-status"]] -
                    statusOrder[b["play-back-status"]],
                )[0];
              }

              if (curPlayer && curPlayer.play_back_status !== "Stopped") {
                return (self.children = [
                  AlbumCover(curPlayer),
                  Widget.Box({
                    class_name: "media-indicator-right-section",
                    hpack: "center",
                    hexpand: true,
                    vertical: true,
                    children: [
                      MediaInfo(curPlayer),
                      Controls(curPlayer),
                      Bar(curPlayer),
                    ],
                  }),
                ]);
              }

              return (self.children = [
                Widget.Box({
                  class_name: "media-indicator-none",
                  hpack: "center",
                  hexpand: true,
                  vpack: "center",
                  child: Widget.Label({
                    class_name: "media-indicator-none-label dim",
                    label: "No Media Is Currently Playing",
                  }),
                }),
              ]);
            });
          },
        }),
      }),
    ],
  });
};

export { Media };
