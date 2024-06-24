const mpris = await Service.import("mpris");
import { closeAllMenus } from "../bar.js";

const Media = () => {
  const activePlayer = Variable(mpris.players[0]);

  mpris.connect("changed", (value) => {
    const statusOrder = {
      Playing: 1,
      Paused: 2,
      Stopped: 3,
    };

    if (value.players.length === 0) {
      activePlayer.value = mpris.players[0];
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

  const songIcon = Variable("");

  const label = Utils.watch("󰎇 No media playing 󰎇", mpris, "changed", () => {
    if (activePlayer.value) {
      const { track_title, identity } = activePlayer.value;
      songIcon.value = getIconForPlayer(identity);
      return track_title.length === 0
        ? `  No media playing...`
        : `  ${track_title}`;
    } else {
      songIcon.value = "";
      return "󰎇 No media playing 󰎇";
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
        child: Widget.Box({
          children: [
            Widget.Label({
              class_name: "bar-media_icon",
              label: songIcon.bind("value"),
              maxWidthChars: 30,
            }),
            Widget.Label({
              label,
              truncate: "end",
              wrap: true,
              maxWidthChars: 30,
            }),
          ],
        }),
      }),
    }),
    isVisible: false,
    name: "media",
    props: {
      on_primary_click: (_, event) => {
        const clickPos = event.get_root_coords();
        const coords = [clickPos[1], clickPos[2]];

        globalMousePos.value = coords;

        closeAllMenus();
        App.toggleWindow("mediamenu");
      },
    },
  };
};

export { Media };
