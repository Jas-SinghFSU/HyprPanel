import icons from "../../../icons/index.js";
const media = await Service.import("mpris");

const Controls = () => {
  const curPlayer = Variable(media.players[0]);

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
      )[0];
    }
  });
  if (curPlayer.value === undefined) {
    return Widget.Box();
  }
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
                  curPlayer.value.shuffle_status !== null
                    ? curPlayer.value.shuffle_status
                      ? "Shuffling"
                      : "Not Shuffling"
                    : null,
                hasTooltip: true,
                on_primary_click: () => curPlayer.value.shuffle(),
                class_name: `media-indicator-control-button shuffle ${isShuffleActive(curPlayer.value)} ${curPlayer.value.shuffle_status !== null ? "enabled" : "disabled"}`,
                child: Widget.Icon(icons.mpris.shuffle["enabled"]),
              }),
            ],
          }),
          Widget.Box({
            class_name: `media-indicator-control prev ${curPlayer.value.can_go_prev}`,
            children: [
              Widget.Button({
                hpack: "center",
                on_primary_click: () => curPlayer.value.previous(),
                class_name: `media-indicator-control-button prev ${curPlayer.value.can_go_prev ? "enabled" : "disabled"}`,
                child: Widget.Icon(icons.mpris.prev),
              }),
            ],
          }),
          Widget.Box({
            class_name: "media-indicator-control play",
            children: [
              Widget.Button({
                hpack: "center",
                on_primary_click: () => curPlayer.value.playPause(),
                class_name: `media-indicator-control-button play ${curPlayer.value.can_play ? "enabled" : "disabled"}`,
                child: Widget.Icon(
                  icons.mpris[curPlayer.value.play_back_status.toLowerCase()],
                ),
              }),
            ],
          }),
          Widget.Box({
            class_name: `media-indicator-control next`,
            children: [
              Widget.Button({
                hpack: "center",
                on_primary_click: () => curPlayer.value.next(),
                class_name: `media-indicator-control-button next ${curPlayer.value.can_go_next ? "enabled" : "disabled"}`,
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
                  curPlayer.value.loop_status !== null
                    ? `Looping: ${curPlayer.value.loop_status}`
                    : null,
                hasTooltip: true,
                on_primary_click: () => curPlayer.value.loop(),
                class_name: `media-indicator-control-button loop ${isLoopActive(curPlayer.value)} ${curPlayer.value.loop_status !== null ? "enabled" : "disabled"}`,
                child: Widget.Icon(
                  curPlayer.value.loop_status === null
                    ? icons.mpris.loop["none"]
                    : icons.mpris.loop[curPlayer.value.loop_status?.toLowerCase()],
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
