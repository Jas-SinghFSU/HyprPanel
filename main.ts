import { exec } from "resource:///com/github/Aylur/ags/utils.js";
import DirectoryMonitorService from "./directoryMonitorService.js";
import "lib/session"
import { Bar } from "modules/bar/Bar"
import MenuWindows from "./modules/menus/main.js";
import Notifications from "./modules/notifications/index.js";
import { forMonitors } from "lib/utils"

const applyScss = () => {
  // Compile scss
  exec(`sass ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
  exec(
    `sass ${App.configDir}/scss/highlight.scss ${App.configDir}/highlight.css`,
  );
  console.log("Scss compiled");

  // Apply compiled css
  App.resetCss();
  App.applyCss(`${App.configDir}/style.css`);
  console.log("Compiled css applied");
};

DirectoryMonitorService.connect("changed", () => applyScss());

applyScss();

App.config({
  onConfigParsed: () => Utils.execAsync(`python3 ${App.configDir}/services/bluetooth.py`),
  windows: [
    ...MenuWindows,
    Notifications(),
    ...forMonitors(Bar),
  ],
  style: `${App.configDir}/style.css`,
  closeWindowDelay: {
    sideright: 350,
    launcher: 350,
    bar0: 350,
  },
})
