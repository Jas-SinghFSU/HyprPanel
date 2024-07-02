const Bar = (curPlayer) => {
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
            return (curPlayer.position = value * curPlayer.length);
          },
          setup: (self) => {
            const update = () => {
              if (
                typeof curPlayer.position === "number" &&
                curPlayer.position > 0 &&
                typeof curPlayer.length === "number" &&
                curPlayer.length > 0
              ) {
                const value = curPlayer.position / curPlayer.length;
                self.value = value > 0 ? value : 0;
              } else {
                self.value = 0;
              }
            };
            self.hook(curPlayer, update);
            self.hook(curPlayer, update, "position");
            self.poll(1000, update);

            function updateTooltip() {
              const curHour = Math.floor(curPlayer.position / 3600);
              const curMin = Math.floor((curPlayer.position % 3600) / 60);
              const curSec = Math.floor(curPlayer.position % 60);

              if (
                typeof curPlayer.position === "number" &&
                curPlayer.position >= 0
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
            self.hook(curPlayer, updateTooltip);
          },
        }),
      }),
    ],
  });
};

export { Bar };
