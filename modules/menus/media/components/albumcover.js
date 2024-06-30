const AlbumCover = (curPlayer) => {
  if (
    typeof curPlayer.track_cover_url === "string" &&
    curPlayer.track_cover_url.length > 0
  ) {
    return Widget.Box({
      vexpand: false,
      vpack: "center",
      class_name: "media-indicator-current-album-cover",
      css: `background-image: url("${curPlayer.track_cover_url}")`,
    });
  }
  return Widget.Box();
};

export { AlbumCover };
