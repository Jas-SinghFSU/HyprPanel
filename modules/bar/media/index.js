const mpris = await Service.import("mpris");

const Media = () => {
  const activePlayer = Variable(mpris.players[0]);
  mpris.connect("changed", (value) => {
    const statusOrder = {
      Playing: 1,
      Paused: 2,
      Stopped: 3,
    };

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

  const label = Utils.watch("", mpris, "player-changed", () => {
    if (activePlayer.value) {
      const { track_artists, track_title } = activePlayer.value;
      return `󰝚  ${track_title} - ${track_artists.join(", ")} 󰝚`;
    } else {
      return "Nothing is playing";
    }
  });

  return {
    component: Widget.Box({
      visible: false,
      child: Widget.Button({
        class_name: "media",
        on_primary_click: () => mpris.getPlayer("")?.playPause(),
        on_scroll_up: () => mpris.getPlayer("")?.next(),
        on_scroll_down: () => mpris.getPlayer("")?.previous(),
        child: Widget.Label({ label }),
      }),
    }),
    isVisible: false,
    name: "media",
  };
};

export { Media };
