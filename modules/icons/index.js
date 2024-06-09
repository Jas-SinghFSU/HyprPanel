export default {
  settings: "emblem-system-symbolic",
  tick: "object-select-symbolic",
  audio: {
    mic: {
      muted: "microphone-sensitivity-muted-symbolic",
      unmuted: "audio-input-microphone-symbolic",
      low: "microphone-sensitivity-low-symbolic",
      medium: "microphone-sensitivity-medium-symbolic",
      high: "microphone-sensitivity-high-symbolic",
    },
    volume: {
      muted: "audio-volume-muted-symbolic",
      low: "audio-volume-low-symbolic",
      medium: "audio-volume-medium-symbolic",
      high: "audio-volume-high-symbolic",
      overamplified: "audio-volume-overamplified-symbolic",
    },
    type: {
      headset: "audio-headphones-symbolic",
      speaker: "audio-speakers-symbolic",
      card: "audio-card-symbolic",
    },
    mixer: "view-list-symbolic",
  },
  apps: {
    apps: "view-app-grid-symbolic",
    search: "folder-saved-search-symbolic",
  },
  launcher: {
    search: "system-search-symbolic",
    utility: "applications-utilities-symbolic",
    system: "emblem-system-symbolic",
    education: "applications-science-symbolic",
    development: "applications-engineering-symbolic",
    network: "network-wired-symbolic",
    office: "x-office-document-symbolic",
    game: "applications-games-symbolic",
    multimedia: "applications-multimedia-symbolic",
    hyprland: "hyprland-symbolic",
    firefox: "firefox-symbolic"
  },
  quicksettings: {
    notifications: "user-available-symbolic",
    wifi: "network-wireless-symbolic",
    bluetooth: "bluetooth-active-symbolic",
    audio: "audio-volume-high-symbolic",
    mpris: "audio-x-generic-symbolic",
    chatgpt: "chatgpt-symbolic"
  },
  bluetooth: {
    enabled: "bluetooth-active-symbolic",
    disabled: "bluetooth-disabled-symbolic",
  },
  brightness: {
    indicator: "display-brightness-symbolic",
    keyboard: "keyboard-brightness-symbolic",
    screen: ["󰛩", "󱩎", "󱩏", "󱩐", "󱩑", "󱩒", "󱩓", "󱩔", "󱩕", "󱩖", "󰛨"],
  },
  powermenu: {
    sleep: "weather-clear-night-symbolic",
    reboot: "system-reboot-symbolic",
    logout: "system-log-out-symbolic",
    shutdown: "system-shutdown-symbolic",
    lock: "system-lock-screen-symbolic",
    close: "window-close-symbolic"
  },
  recorder: {
    recording: "media-record-symbolic",
  },
  notifications: {
    noisy: "user-available-symbolic",
    silent: "notifications-disabled-symbolic",
    critical: "messagebox_critical-symbolic",
    chat: "user-available-symbolic",
    close: "window-close-symbolic"
  },
  header: {
    refresh: "view-refresh-symbolic",
    settings: "emblem-system-symbolic",
    power: "system-shutdown-symbolic",
  },
  trash: {
    full: "user-trash-full-symbolic",
    empty: "user-trash-symbolic",
  },
  mpris: {
    fallback: "audio-x-generic-symbolic",
    shuffle: {
      enabled: "media-playlist-shuffle-symbolic",
      disabled: "media-playlist-no-shuffle-symbolic",
    },
    loop: {
      none: "media-playlist-no-repeat-symbolic",
      track: "media-playlist-repeat-song-symbolic",
      playlist: "media-playlist-repeat-symbolic",
    },
    playing: "media-playback-pause-symbolic",
    paused: "media-playback-start-symbolic",
    stopped: "media-playback-stop-symbolic",
    prev: "media-skip-backward-symbolic",
    next: "media-skip-forward-symbolic",
  },
  ai: "chatgpt-symbolic",
  ui: {
    send: "mail-send-symbolic",
    arrow: {
      right: "pan-end-symbolic",
      left: "pan-start-symbolic",
      down: "pan-down-symbolic",
      up: "pan-up-symbolic",
    },
  },
  weather: {
    day: {
      "113": "\uf00d", //"Sunny",
      "116": "\uf002", //"PartlyCloudy",
      "119": "\uf041", //"Cloudy",
      "122": "\uf013", //"VeryCloudy",
      "143": "\uf003", //"Fog",
      "176": "\uf01a", //"LightShowers",
      "179": "\uf017", //"LightSleetShowers",
      "182": "\uf0b5", //"LightSleet",
      "185": "\uf0b5", //"LightSleet",
      "200": "\uf01d", //"ThunderyShowers",
      "227": "\uf01b", //"LightSnow",
      "230": "\uf01b", //"HeavySnow",
      "248": "\uf014", //"Fog",
      "260": "\uf014", //"Fog",
      "263": "\uf01a", //"LightShowers",
      "266": "\uf01a", //"LightRain",
      "281": "\uf0b5", //"LightSleet",
      "284": "\uf0b5", //"LightSleet",
      "293": "\uf01a", //"LightRain",
      "296": "\uf01a", //"LightRain",
      "299": "\uf019", //"HeavyShowers",
      "302": "\uf019", //"HeavyRain",
      "305": "\uf019", //"HeavyShowers",
      "308": "\uf019", //"HeavyRain",
      "311": "\uf0b5", //"LightSleet",
      "314": "\uf0b5", //"LightSleet",
      "317": "\uf0b5", //"LightSleet",
      "320": "\uf01b", //"LightSnow",
      "323": "\uf017", //"LightSnowShowers",
      "326": "\uf017", //"LightSnowShowers",
      "329": "\uf01b", //"HeavySnow",
      "332": "\uf01b", //"HeavySnow",
      "335": "\uf01b", //"HeavySnowShowers",
      "338": "\uf01b", //"HeavySnow",
      "350": "\uf0b5", //"LightSleet",
      "353": "\uf01a", //"LightShowers",
      "356": "\uf019", //"HeavyShowers",
      "359": "\uf019", //"HeavyRain",
      "362": "\uf017", //"LightSleetShowers",
      "365": "\uf017", //"LightSleetShowers",
      "368": "\uf017", //"LightSnowShowers",
      "371": "\uf017", //"HeavySnowShowers",
      "374": "\uf0b5", //"LightSleetShowers",
      "377": "\uf0b5", //"LightSleet",
      "386": "\uf01e", //"ThunderyShowers",
      "389": "\uf01e", //"ThunderyHeavyRain",
      "392": "\uf01e", //"ThunderySnowShowers",
      "395": "\uf01b", //"HeavySnowShowers",
    },
    night: {
      "113": "\uf02e", // Night
      "116": "\uf086", // Partly cloudy, night
      "119": "\uf086", // Partly cloudy, night
    }
  }
};



