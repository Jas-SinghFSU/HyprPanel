const media = await Service.import("mpris");
import DropdownMenu from "../DropdownMenu.js";
import icons from "../../icons/index.js";

media.cacheCoverArt = false;

export default () => {
  const activePlayer = Variable(media.players[0]);

  media.connect("changed", (value) => {
    const statusOrder = {
      Playing: 1,
      Paused: 2,
      Stopped: 3,
    };

    if (value.players.length === 0) {
      activePlayer.value = media.players[0];
      return;
    }

    const isPlaying = value.players.find(
      (p) => p["play-back-status"] === "Playing",
    );

    if (isPlaying) {
      activePlayer.value = value.players.sort(
        (a, b) =>
          statusOrder[a["play-back-status"]] -
          statusOrder[b["play-back-status"]],
      )[0];
    }
  });

  const isLoopActive = (player) => {
    return player["loop-status"] !== null &&
      ["track", "playlist"].includes(player["loop-status"].toLowerCase())
      ? "active"
      : "";
  };

  const isShuffleActive = (player) => {
    return player["shuffle-status"] !== null && player["shuffle-status"]
      ? "active"
      : "";
  };

  return DropdownMenu({
    name: "mediamenu",
    transition: "crossfade",
    fixed: true,
    minWidth: 550,
    child: Widget.Box({
      class_name: "media-indicator-container",
      vertical: true,
      hexpand: true,
      vexpand: true,
      child: Widget.Box({
        class_name: "media-indicator-items",
        vexpand: true,
        hexpand: true,
        vertical: true,
        children: [
          Widget.Box({
            class_name: "media-indicator-current-player-info",
            vpack: "center",
            hexpand: true,
            setup: (self) => {
              self.hook(activePlayer, () => {
                self.hook(media, () => {
                  const curPlayer = activePlayer.value;

                  const albumCover = (player) => {
                    if (
                      typeof player.track_cover_url === "string" &&
                      player.track_cover_url.length > 0
                    ) {
                      return [
                        Widget.Box({
                          vexpand: false,
                          vpack: "center",
                          class_name: "media-indicator-current-album-cover",
                          css: `background-image: url("${curPlayer.track_cover_url}")`,
                        }),
                      ];
                    }
                    return [];
                  };
                  if (curPlayer && curPlayer.play_back_status !== "Stopped") {
                    return (self.children = [
                      ...albumCover(curPlayer),
                      Widget.Box({
                        class_name: "media-indicator-right-section",
                        hpack: "center",
                        hexpand: true,
                        vertical: true,
                        children: [
                          Widget.Box({
                            class_name: "media-indicator-current-media-info",
                            hpack: "center",
                            hexpand: true,
                            vertical: true,
                            children: [
                              Widget.Box({
                                class_name: "media-indicator-current-song-name",
                                hpack: "center",
                                children: [
                                  Widget.Label({
                                    truncate: "end",
                                    max_width_chars: 21,
                                    wrap: true,
                                    class_name:
                                      "media-indicator-current-song-name-label",
                                    label: curPlayer["track-title"],
                                  }),
                                ],
                              }),
                              Widget.Box({
                                class_name:
                                  "media-indicator-current-song-author",
                                hpack: "center",
                                children: [
                                  Widget.Label({
                                    truncate: "end",
                                    wrap: true,
                                    max_width_chars: 25,
                                    class_name:
                                      "media-indicator-current-song-author-label",
                                    label:
                                      curPlayer["track-artists"].join(", "),
                                  }),
                                ],
                              }),
                              Widget.Box({
                                class_name:
                                  "media-indicator-current-song-album",
                                hpack: "center",
                                children: [
                                  Widget.Label({
                                    truncate: "end",
                                    wrap: true,
                                    max_width_chars: 25,
                                    class_name:
                                      "media-indicator-current-song-album-label",
                                    label: curPlayer["track-album"],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          Widget.Box({
                            class_name:
                              "media-indicator-current-player-controls",
                            vertical: true,
                            children: [
                              Widget.Box({
                                class_name: "media-indicator-current-controls",
                                hpack: "center",
                                children: [
                                  Widget.Box({
                                    class_name:
                                      "media-indicator-control shuffle",
                                    children: [
                                      Widget.Button({
                                        hpack: "center",
                                        tooltip_text:
                                          curPlayer.shuffle_status !== null
                                            ? curPlayer.shuffle_status
                                              ? "Shuffling"
                                              : "Not Shuffling"
                                            : null,
                                        hasTooltip: true,
                                        on_primary_click: () =>
                                          curPlayer.shuffle(),
                                        class_name: `media-indicator-control-button shuffle ${isShuffleActive(curPlayer)} ${curPlayer.shuffle_status !== null ? "enabled" : "disabled"}`,
                                        child: Widget.Icon(
                                          icons.mpris.shuffle["enabled"],
                                        ),
                                      }),
                                    ],
                                  }),
                                  Widget.Box({
                                    class_name: `media-indicator-control prev ${curPlayer.can_go_prev}`,
                                    children: [
                                      Widget.Button({
                                        hpack: "center",
                                        on_primary_click: () =>
                                          curPlayer.previous(),
                                        class_name: `media-indicator-control-button prev ${curPlayer.can_go_prev ? "enabled" : "disabled"}`,
                                        child: Widget.Icon(icons.mpris.prev),
                                      }),
                                    ],
                                  }),
                                  Widget.Box({
                                    class_name: "media-indicator-control play",
                                    children: [
                                      Widget.Button({
                                        hpack: "center",
                                        on_primary_click: () =>
                                          curPlayer.playPause(),
                                        class_name: `media-indicator-control-button play ${curPlayer.can_play ? "enabled" : "disabled"}`,
                                        child: Widget.Icon(
                                          icons.mpris[
                                            curPlayer.play_back_status.toLowerCase()
                                          ],
                                        ),
                                      }),
                                    ],
                                  }),
                                  Widget.Box({
                                    class_name: `media-indicator-control next`,
                                    children: [
                                      Widget.Button({
                                        hpack: "center",
                                        on_primary_click: () =>
                                          curPlayer.next(),
                                        class_name: `media-indicator-control-button next ${curPlayer.can_go_next ? "enabled" : "disabled"}`,
                                        child: Widget.Icon(icons.mpris.next),
                                      }),
                                    ],
                                  }),
                                  Widget.Box({
                                    class_name: "media-indicator-control loop",
                                    children: [
                                      Widget.Button({
                                        hpack: "center",
                                        tooltip_text:
                                          curPlayer.loop_status !== null
                                            ? `Looping: ${curPlayer.loop_status}`
                                            : null,
                                        hasTooltip: true,
                                        on_primary_click: () =>
                                          curPlayer.loop(),
                                        class_name: `media-indicator-control-button loop ${isLoopActive(curPlayer)} ${curPlayer.loop_status !== null ? "enabled" : "disabled"}`,
                                        child: Widget.Icon(
                                          curPlayer.loop_status === null
                                            ? icons.mpris.loop["none"]
                                            : icons.mpris.loop[
                                                curPlayer.loop_status?.toLowerCase()
                                              ],
                                        ),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          Widget.Box({
                            class_name: "media-indicator-current-progress-bar",
                            hexpand: true,
                            children: [
                              Widget.Box({
                                hexpand: true,
                                child: Widget.Slider({
                                  hexpand: true,
                                  tooltip_text: "yoyo",
                                  class_name: "menu-slider media progress",
                                  draw_value: false,
                                  on_change: ({ value }) =>
                                    (curPlayer.position =
                                      value * curPlayer.length),
                                  visible: curPlayer
                                    .bind("length")
                                    .as((l) => l > 0),
                                  setup: (self) => {
                                    const update = () => {
                                      if (
                                        typeof curPlayer.position ===
                                          "number" &&
                                        curPlayer.position > 0
                                      ) {
                                        const value =
                                          curPlayer.position / curPlayer.length;
                                        self.value = value > 0 ? value : 0;
                                      }
                                      return 0;
                                    };
                                    self.hook(curPlayer, update);
                                    self.hook(curPlayer, update, "position");
                                    self.poll(1000, update);

                                    function updateTooltip() {
                                      const curHour = Math.floor(
                                        curPlayer.position / 3600,
                                      );
                                      const curMin = Math.floor(
                                        (curPlayer.position % 3600) / 60,
                                      );
                                      const curSec = Math.floor(
                                        curPlayer.position % 60,
                                      );

                                      if (
                                        typeof curPlayer.position ===
                                          "number" &&
                                        curPlayer.position >= 0
                                      ) {
                                        // WARN: These nested ternaries are absolutely disgusting lol
                                        self.tooltip_text = `${
                                          curHour > 0
                                            ? (curHour < 10
                                                ? "0" + curHour
                                                : curHour) + ":"
                                            : ""
                                        }${curMin < 10 ? "0" + curMin : curMin}:${curSec < 10 ? "0" + curSec : curSec}`;
                                      } else {
                                        self.tooltip_text = `00:00`;
                                      }
                                    }
                                    self.poll(1000, updateTooltip);
                                    self.hook(curPlayer, updateTooltip);
                                  },
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ]);
                  }

                  return (self.children = [
                    Widget.Box({
                      class_name: "media-indicator-none",
                      hpack: "center",
                      vpack: "center",
                      expand: true,
                      child: Widget.Label({
                        class_name: "media-indicator-none-label dim",
                        label: "No Media Is Currently Playing",
                      }),
                    }),
                  ]);
                });
              });
            },
          }),
        ],
      }),
    }),
  });
};
