const media = await Service.import("mpris");

const MediaInfo = () => {
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
    console.log('changed');
  });
  return Widget.Box({
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
            max_width_chars: 35,
            wrap: true,
            class_name: "media-indicator-current-song-name-label",
            setup: (self) => {
              self.hook(curPlayer, () => {
                console.log('did change')
                return (self.label = curPlayer.value["track-title"]);
              });
            },
          }),
        ],
      }),
      Widget.Box({
        class_name: "media-indicator-current-song-author",
        hpack: "center",
        children: [
          Widget.Label({
            truncate: "end",
            wrap: true,
            max_width_chars: 35,
            class_name: "media-indicator-current-song-author-label",
            setup: (self) => {
              self.hook(curPlayer, () => {
                console.log(JSON.stringify(curPlayer, null, 2));
                return (self.label = curPlayer.value["track-title"]);
              });
            },
          }),
        ],
      }),
      Widget.Box({
        class_name: "media-indicator-current-song-album",
        hpack: "center",
        children: [
          Widget.Label({
            truncate: "end",
            wrap: true,
            max_width_chars: 40,
            class_name: "media-indicator-current-song-album-label",
            setup: (self) => {
              self.hook(curPlayer, () => {
                return (self.label = curPlayer.value["track-album"]);
              });
            },
          }),
        ],
      }),
    ],
  });
};

export { MediaInfo };
