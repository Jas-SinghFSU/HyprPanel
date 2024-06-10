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

  const getIconForPlayer = (playerName) => {
    const windowTitleMap = [
      ["Mozilla Firefox", "󰈹"],
      ["Microsoft Edge", "󰇩"],
      ["(.*)Discord(.*)", ""],
      ["Plex", "󰚺  Plex"],
      ["(.*) Spotify Free", "󰓇"],
      ["(.*)Spotify Premium", "󰓇"],
      ["Spotify", "󰓇"],
      ["(.*)", "󰝚"],
    ];

    const foundMatch = windowTitleMap.find((wt) =>
      RegExp(wt[0]).test(playerName),
    );

    return foundMatch ? foundMatch[1] : "󰝚";
  };

  const label = Utils.watch("󰎇 Nothing is playing 󰎇", mpris, "player-changed", () => {
    if (activePlayer.value) {
      const { track_title, identity } = activePlayer.value;
      return `${getIconForPlayer(identity)}  ${track_title}`;
    } else {
      return "󰎇 Nothing is playing 󰎇";
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
        child: Widget.Label({
          label,
          truncate: 'end',
          wrap: true,
          maxWidthChars: 30,
        }),
      }),
    }),
    isVisible: false,
    name: "media",
  };
};

export { Media };
