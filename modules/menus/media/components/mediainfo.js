const MediaInfo = (curPlayer) => {
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
            max_width_chars: 21,
            wrap: true,
            class_name: "media-indicator-current-song-name-label",
            label: curPlayer["track-title"],
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
            max_width_chars: 25,
            class_name: "media-indicator-current-song-author-label",
            label: curPlayer["track-artists"].join(", "),
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
            max_width_chars: 25,
            class_name: "media-indicator-current-song-album-label",
            label: curPlayer["track-album"],
          }),
        ],
      }),
    ],
  });
};

export { MediaInfo };
