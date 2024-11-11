// Projects/HyprPanel/lib/icons.ts
var icons_default = {
  missing: "image-missing-symbolic",
  nix: {
    nix: "nix-snowflake-symbolic"
  },
  app: {
    terminal: "terminal-symbolic"
  },
  fallback: {
    executable: "application-x-executable",
    notification: "dialog-information-symbolic",
    video: "video-x-generic-symbolic",
    audio: "audio-x-generic-symbolic"
  },
  ui: {
    close: "window-close-symbolic",
    colorpicker: "color-select-symbolic",
    info: "info-symbolic",
    link: "external-link-symbolic",
    lock: "system-lock-screen-symbolic",
    menu: "open-menu-symbolic",
    refresh: "view-refresh-symbolic",
    search: "system-search-symbolic",
    settings: "emblem-system-symbolic",
    themes: "preferences-desktop-theme-symbolic",
    tick: "object-select-symbolic",
    time: "hourglass-symbolic",
    toolbars: "toolbars-symbolic",
    warning: "dialog-warning-symbolic",
    arrow: {
      right: "pan-end-symbolic",
      left: "pan-start-symbolic",
      down: "pan-down-symbolic",
      up: "pan-up-symbolic"
    }
  },
  audio: {
    mic: {
      muted: "microphone-disabled-symbolic",
      low: "microphone-sensitivity-low-symbolic",
      medium: "microphone-sensitivity-medium-symbolic",
      high: "microphone-sensitivity-high-symbolic"
    },
    volume: {
      muted: "audio-volume-muted-symbolic",
      low: "audio-volume-low-symbolic",
      medium: "audio-volume-medium-symbolic",
      high: "audio-volume-high-symbolic",
      overamplified: "audio-volume-overamplified-symbolic"
    },
    type: {
      headset: "audio-headphones-symbolic",
      speaker: "audio-speakers-symbolic",
      card: "audio-card-symbolic"
    },
    mixer: "mixer-symbolic"
  },
  powerprofile: {
    balanced: "power-profile-balanced-symbolic",
    "power-saver": "power-profile-power-saver-symbolic",
    performance: "power-profile-performance-symbolic"
  },
  asusctl: {
    profile: {
      Balanced: "power-profile-balanced-symbolic",
      Quiet: "power-profile-power-saver-symbolic",
      Performance: "power-profile-performance-symbolic"
    },
    mode: {
      Integrated: "processor-symbolic",
      Hybrid: "controller-symbolic"
    }
  },
  battery: {
    charging: "battery-flash-symbolic",
    warning: "battery-empty-symbolic"
  },
  bluetooth: {
    enabled: "bluetooth-active-symbolic",
    disabled: "bluetooth-disabled-symbolic"
  },
  brightness: {
    indicator: "display-brightness-symbolic",
    keyboard: "keyboard-brightness-symbolic",
    screen: "display-brightness-symbolic"
  },
  powermenu: {
    sleep: "weather-clear-night-symbolic",
    reboot: "system-reboot-symbolic",
    logout: "system-log-out-symbolic",
    shutdown: "system-shutdown-symbolic"
  },
  recorder: {
    recording: "media-record-symbolic"
  },
  notifications: {
    noisy: "org.gnome.Settings-notifications-symbolic",
    silent: "notifications-disabled-symbolic",
    message: "chat-bubbles-symbolic"
  },
  trash: {
    full: "user-trash-full-symbolic",
    empty: "user-trash-symbolic"
  },
  mpris: {
    shuffle: {
      enabled: "media-playlist-shuffle-symbolic",
      disabled: "media-playlist-consecutive-symbolic"
    },
    loop: {
      none: "media-playlist-repeat-symbolic",
      track: "media-playlist-repeat-song-symbolic",
      playlist: "media-playlist-repeat-symbolic"
    },
    playing: "media-playback-pause-symbolic",
    paused: "media-playback-start-symbolic",
    stopped: "media-playback-start-symbolic",
    prev: "media-skip-backward-symbolic",
    next: "media-skip-forward-symbolic"
  },
  system: {
    cpu: "org.gnome.SystemMonitor-symbolic",
    ram: "drive-harddisk-solidstate-symbolic",
    temp: "temperature-symbolic"
  },
  color: {
    dark: "dark-mode-symbolic",
    light: "light-mode-symbolic"
  }
};

// Projects/HyprPanel/lib/utils.ts
import Gdk2 from "gi://Gdk";
import GLib3 from "gi://GLib?version=2.0";
import GdkPixbuf2 from "gi://GdkPixbuf";

// Projects/HyprPanel/lib/constants/colors.ts
var namedColors = new Set([
  "alice blue",
  "antique white",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanched almond",
  "blue",
  "blue violet",
  "brown",
  "burlywood",
  "cadet blue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflower blue",
  "cornsilk",
  "crimson",
  "cyan",
  "dark blue",
  "dark cyan",
  "dark goldenrod",
  "dark gray",
  "dark green",
  "dark khaki",
  "dark magenta",
  "dark olive green",
  "dark orange",
  "dark orchid",
  "dark red",
  "dark salmon",
  "dark sea green",
  "dark slate blue",
  "dark slate gray",
  "dark turquoise",
  "dark violet",
  "deep pink",
  "deep sky blue",
  "dim gray",
  "dodger blue",
  "firebrick",
  "floral white",
  "forest green",
  "fuchsia",
  "gainsboro",
  "ghost white",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "green yellow",
  "honeydew",
  "hot pink",
  "indian red",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavender blush",
  "lawn green",
  "lemon chiffon",
  "light blue",
  "light coral",
  "light cyan",
  "light goldenrod yellow",
  "light green",
  "light grey",
  "light pink",
  "light salmon",
  "light sea green",
  "light sky blue",
  "light slate gray",
  "light steel blue",
  "light yellow",
  "lime",
  "lime green",
  "linen",
  "magenta",
  "maroon",
  "medium aquamarine",
  "medium blue",
  "medium orchid",
  "medium purple",
  "medium sea green",
  "medium slate blue",
  "medium spring green",
  "medium turquoise",
  "medium violet red",
  "midnight blue",
  "mint cream",
  "misty rose",
  "moccasin",
  "navajo white",
  "navy",
  "old lace",
  "olive",
  "olive drab",
  "orange",
  "orange red",
  "orchid",
  "pale goldenrod",
  "pale green",
  "pale turquoise",
  "pale violet red",
  "papaya whip",
  "peach puff",
  "peru",
  "pink",
  "plum",
  "powder blue",
  "purple",
  "red",
  "rosy brown",
  "royal blue",
  "saddle brown",
  "salmon",
  "sandy brown",
  "sea green",
  "seashell",
  "sienna",
  "silver",
  "sky blue",
  "slate blue",
  "slate gray",
  "snow",
  "spring green",
  "steel blue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "white smoke",
  "yellow",
  "yellow green"
]);

// Projects/HyprPanel/lib/variables.ts
import GLib2 from "gi://GLib";
var clock = Variable(GLib2.DateTime.new_now_local(), {
  poll: [1000, () => GLib2.DateTime.new_now_local()]
});
var uptime = Variable(0, {
  poll: [60000, "cat /proc/uptime", (line) => Number.parseInt(line.split(".")[0]) / 60]
});
var distro = {
  id: GLib2.get_os_info("ID"),
  logo: GLib2.get_os_info("LOGO")
};

// Projects/HyprPanel/lib/utils.ts
async function bash(strings, ...values) {
  const cmd = typeof strings === "string" ? strings : strings.flatMap((str, i) => str + `${values[i] ?? ""}`).join("");
  return Utils.execAsync(["bash", "-c", cmd]).catch((err) => {
    console.error(cmd, err);
    return "";
  });
}
function dependencies(...bins) {
  const missing = bins.filter((bin) => Utils.exec({
    cmd: `which ${bin}`,
    out: () => false,
    err: () => true
  }));
  if (missing.length > 0) {
    console.warn(Error(`missing dependencies: ${missing.join(", ")}`));
    Notify({
      summary: "Dependencies not found!",
      body: `The following dependencies are missing: ${missing.join(", ")}`,
      iconName: icons_default.ui.warning,
      timeout: 7000
    });
  }
  return missing.length === 0;
}
var Notify = (notifPayload) => {
  let command = "notify-send";
  command += ` "${notifPayload.summary} "`;
  if (notifPayload.body)
    command += ` "${notifPayload.body}" `;
  if (notifPayload.appName)
    command += ` -a "${notifPayload.appName}"`;
  if (notifPayload.iconName)
    command += ` -i "${notifPayload.iconName}"`;
  if (notifPayload.urgency)
    command += ` -u "${notifPayload.urgency}"`;
  if (notifPayload.timeout !== undefined)
    command += ` -t ${notifPayload.timeout}`;
  if (notifPayload.category)
    command += ` -c "${notifPayload.category}"`;
  if (notifPayload.transient)
    command += ` -e`;
  if (notifPayload.id !== undefined)
    command += ` -r ${notifPayload.id}`;
  Utils.execAsync(command);
};

// Projects/HyprPanel/greeter/scss/style.ts
var resetCss = async () => {
  if (!dependencies("sass"))
    return;
  try {
    const css = `${App.configDir}/greeter/dist/main.css`;
    const localScss = `${App.configDir}/scss/main.scss`;
    await bash(`sass --load-path=${App.configDir}/scss/ ${localScss} ${css}`);
    App.applyCss(css, true);
  } catch (error) {
    console.error(error);
  }
};
Utils.monitorFile(`${App.configDir}/scss/style/`, resetCss);
await resetCss();

// Projects/HyprPanel/greeter/session.ts
import GLib4 from "gi://GLib?version=2.0";
var userName = await bash("find /home -maxdepth 1 -printf '%f\n' | tail -n 1");
Object.assign(globalThis, {
  TMP: `${GLib4.get_tmp_dir()}/greeter`,
  OPTIONS: "/var/cache/greeter/options.json",
  WALLPAPER: "/home/jaskir/Pictures/Wallpapers/RosePine/landscape.jpeg",
  USER: userName
});
Utils.ensureDirectory(TMP);

// /home/jaskir/.config/ags/greeter/greeter.ts
import GLib5 from "gi://GLib?version=2.0";

// Projects/HyprPanel/widget/RegularWindow.ts
import Gtk from "gi://Gtk?version=3.0";
var RegularWindow_default = Widget.subclass(Gtk.Window);

// Projects/HyprPanel/greeter/services/loginSession.ts
import Gio from "gi://Gio?version=2.0";
import GdkPixbuf3 from "gi://GdkPixbuf?version=2.0";
var greetd = await Service.import("greetd");

class LoginSession {
  users = [];
  sessions = [];
  loggingIn = Variable(false);
  userName = Variable("");
  password = Variable("");
  constructor() {
  }
  static async create() {
    const login = new LoginSession;
    await login.initialize();
    return login;
  }
  async initialize() {
    await this.getAllUsers();
    await this.getAllSessions();
    this.userName.value = this.users[0];
  }
  async getAllUsers() {
    try {
      const allUsers = await bash("cat /etc/passwd | grep '/home' | cut -d: -f1");
      const allUsersArray = allUsers.split("\n").map((user) => user.trim()).filter((user) => user !== "");
      this.users.push(...allUsersArray);
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }
  async getAllSessionPaths() {
    const sessionFilePaths = [];
    try {
      const allXSessions = await bash("ls /usr/share/xsessions/");
      const xSessionsArray = allXSessions.split("\n").map((sesh) => sesh.trim()).filter((sesh) => sesh !== "");
      xSessionsArray.forEach((sesh) => {
        sessionFilePaths.push(`/usr/share/xsessions/${sesh}`);
      });
      const allWaylandSessions = await bash("ls /usr/share/wayland-sessions/");
      const waylandSessionsArray = allWaylandSessions.split("\n").map((sesh) => sesh.trim()).filter((sesh) => sesh !== "");
      waylandSessionsArray.forEach((sesh) => {
        sessionFilePaths.push(`/usr/share/wayland-sessions/${sesh}`);
      });
    } catch (error) {
      console.error(`Error fetching session paths: ${error}`);
      throw error;
    }
    return sessionFilePaths;
  }
  getSessionFileContent(sessionFilePath) {
    try {
      const sessionFile = Gio.File.new_for_path(sessionFilePath);
      const [success, contents] = sessionFile.load_contents(null);
      if (success) {
        const fileContents = new TextDecoder().decode(contents);
        return fileContents;
      } else {
        console.error(`Failed to load contents of ${sessionFilePath}`);
      }
    } catch (error) {
      console.error(`Failed to read file at ${sessionFilePath}: ${error}`);
    }
    return "";
  }
  parseSessionFile(sessionFile, key) {
    const lines = sessionFile.split("\n");
    for (const line of lines) {
      if (line.startsWith(`${key}=`)) {
        const parts = line.split("=");
        if (parts.length > 1) {
          return parts[1].trim();
        }
      }
    }
  }
  getSessionName(sessionFile) {
    return this.parseSessionFile(sessionFile, "Name");
  }
  getSessionExecCommand(sessionFile) {
    return this.parseSessionFile(sessionFile, "Exec");
  }
  async getAllSessions() {
    try {
      const allSessionPaths = await this.getAllSessionPaths();
      for (const sessionPath of allSessionPaths) {
        const fileContent = this.getSessionFileContent(sessionPath);
        const sessionName = this.getSessionName(fileContent);
        const sessionExec = this.getSessionExecCommand(fileContent);
        if (sessionName && sessionExec) {
          this.sessions.push({
            [sessionName]: sessionExec
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching all sessions: ${error}`);
      throw error;
    }
  }
  getUsers() {
    return this.users;
  }
  getSessions() {
    return this.sessions;
  }
  getProfilePicture(user) {
    const defaultAvatar = `${App.configDir}/assets/images/avatar.png`;
    const userProfilePicture = `/var/lib/AccountsService/icons/${user}`;
    const file = Gio.File.new_for_path(userProfilePicture);
    if (!file.query_exists(null)) {
      return defaultAvatar;
    }
    try {
      const pixbuf = GdkPixbuf3.Pixbuf.new_from_file(userProfilePicture);
      if (pixbuf) {
        return userProfilePicture;
      }
    } catch (error) {
      console.error(`Failed to load image from ${userProfilePicture}: ${error}`);
    }
    return defaultAvatar;
  }
  getCurrentProfilePicture() {
    const defaultAvatar = `${App.configDir}/assets/images/avatar.png`;
    const userProfilePicture = `/var/lib/AccountsService/icons/${this.userName}`;
    const file = Gio.File.new_for_path(userProfilePicture);
    if (!file.query_exists(null)) {
      return defaultAvatar;
    }
    try {
      const pixbuf = GdkPixbuf3.Pixbuf.new_from_file(userProfilePicture);
      if (pixbuf) {
        return userProfilePicture;
      }
    } catch (error) {
      console.error(`Failed to load image from ${userProfilePicture}: ${error}`);
    }
    return defaultAvatar;
  }
  async login(sessionExec) {
    this.loggingIn.value = true;
    return greetd.login(this.userName.value, this.password.value, sessionExec).catch((res) => {
      this.loggingIn.value = false;
      return res?.description || JSON.stringify(res);
    });
  }
}
var loginSession = await LoginSession.create();
var loginSession_default = loginSession;

// Projects/HyprPanel/greeter/components/auth/input/index.ts
var passwordInput = () => {
  return Widget.Entry({
    className: "login-password",
    on_change: (self) => {
    },
    on_accept: (self) => {
    },
    setup: (self) => {
      self.grab_focus();
    }
  });
};

// Projects/HyprPanel/greeter/components/auth/profile/name.ts
var profileName = () => {
  return Widget.Label({
    className: "profileName",
    label: "Jaskir"
  });
};

// Projects/HyprPanel/greeter/components/auth/profile/picture.ts
var profilePicture = () => {
  return Widget.Box({
    className: "profilePicture",
    css: `background-image: url("${loginSession_default.getCurrentProfilePicture()}")`
  });
};

// Projects/HyprPanel/greeter/components/auth/index.ts
console.log(loginSession_default.getUsers());
console.log(loginSession_default.getSessions());
console.log(loginSession_default.getProfilePicture("jaskirs"));
var auth_default = Widget.Box({
  class_name: "auth",
  expand: true,
  vertical: true,
  children: [profilePicture(), profileName(), passwordInput()]
});

// /home/jaskir/.config/ags/greeter/greeter.ts
var win = RegularWindow_default({
  name: "greeter",
  className: "greeter-window",
  css: `background-image: url('/home/jaskir/Pictures/Wallpapers/RosePine/landscape.jpeg')`,
  setup: (self) => {
    self.set_default_size(1000, 1000);
    self.show_all();
  },
  child: Widget.Overlay({
    child: Widget.Box({ expand: true }),
    overlays: [
      Widget.Box({
        vpack: "center",
        hpack: "center",
        child: auth_default
      })
    ]
  })
});
App.config({
  windows: [win],
  cursorTheme: GLib5.getenv("XCURSOR_THEME")
});
