const media = await Service.import("mpris");

const MediaInfo = (getPlayerInfo) => {
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
            max_width_chars: 31,
            wrap: true,
            class_name: "media-indicator-current-song-name-label",
            setup: (self) => {
              self.hook(media, () => {
                const curPlayer = getPlayerInfo();
                return (self.label = curPlayer !== undefined ? curPlayer["track-title"] : "No media currently playing");
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
              self.hook(media, () => {
                const curPlayer = getPlayerInfo();
                return (self.label = curPlayer !== undefined ? curPlayer["track-artists"].join(', ') : "-----");
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
              self.hook(media, () => {
                const curPlayer = getPlayerInfo();
                return (self.label = curPlayer !== undefined ? curPlayer["track-album"] : "---");
              });
            },
          }),
        ],
      }),
    ],
  });
};

export { MediaInfo };
