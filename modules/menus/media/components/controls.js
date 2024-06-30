import icons from "../../../icons/index.js";

const Controls = (curPlayer) => {
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

  return Widget.Box({
    class_name: "media-indicator-current-player-controls",
    vertical: true,
    children: [
      Widget.Box({
        class_name: "media-indicator-current-controls",
        hpack: "center",
        children: [
          Widget.Box({
            class_name: "media-indicator-control shuffle",
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
                on_primary_click: () => curPlayer.shuffle(),
                class_name: `media-indicator-control-button shuffle ${isShuffleActive(curPlayer)} ${curPlayer.shuffle_status !== null ? "enabled" : "disabled"}`,
                child: Widget.Icon(icons.mpris.shuffle["enabled"]),
              }),
            ],
          }),
          Widget.Box({
            class_name: `media-indicator-control prev ${curPlayer.can_go_prev}`,
            children: [
              Widget.Button({
                hpack: "center",
                on_primary_click: () => curPlayer.previous(),
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
                on_primary_click: () => curPlayer.playPause(),
                class_name: `media-indicator-control-button play ${curPlayer.can_play ? "enabled" : "disabled"}`,
                child: Widget.Icon(
                  icons.mpris[curPlayer.play_back_status.toLowerCase()],
                ),
              }),
            ],
          }),
          Widget.Box({
            class_name: `media-indicator-control next`,
            children: [
              Widget.Button({
                hpack: "center",
                on_primary_click: () => curPlayer.next(),
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
                on_primary_click: () => curPlayer.loop(),
                class_name: `media-indicator-control-button loop ${isLoopActive(curPlayer)} ${curPlayer.loop_status !== null ? "enabled" : "disabled"}`,
                child: Widget.Icon(
                  curPlayer.loop_status === null
                    ? icons.mpris.loop["none"]
                    : icons.mpris.loop[curPlayer.loop_status?.toLowerCase()],
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export { Controls };
