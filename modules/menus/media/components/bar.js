const media = await Service.import("mpris");

const Bar = (getPlayerInfo) => {
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

  return Widget.Box({
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
          on_change: ({ value }) => {
            const foundPlayer = getPlayerInfo(media);
            return (foundPlayer.position = value * foundPlayer.length);
          },
          setup: (self) => {
            const update = () => {
              const foundPlayer = getPlayerInfo(media);
              if (foundPlayer !== undefined) {
                const value = foundPlayer.position / foundPlayer.length;
                self.value = value > 0 ? value : 0;
              } else {
                self.value = 0;
              }
            };
            self.hook(media, update);
            self.poll(1000, update);

            function updateTooltip() {
              const foundPlayer = getPlayerInfo(media);
              if (foundPlayer === undefined) {
                return self.tooltip_text = '0:0'
              }
              const curHour = Math.floor(foundPlayer.position / 3600);
              const curMin = Math.floor((foundPlayer.position % 3600) / 60);
              const curSec = Math.floor(foundPlayer.position % 60);

              if (
                typeof foundPlayer.position === "number" &&
                foundPlayer.position >= 0
              ) {
                // WARN: These nested ternaries are absolutely disgusting lol
                self.tooltip_text = `${
                  curHour > 0
                    ? (curHour < 10 ? "0" + curHour : curHour) + ":"
                    : ""
                }${curMin < 10 ? "0" + curMin : curMin}:${curSec < 10 ? "0" + curSec : curSec}`;
              } else {
                self.tooltip_text = `00:00`;
              }
            }
            self.poll(1000, updateTooltip);
            self.hook(media, updateTooltip);
          },
        }),
      }),
    ],
  });
};

export { Bar };
