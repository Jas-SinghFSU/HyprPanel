import {exec, idle, monitorFile} from "resource:///com/github/Aylur/ags/utils.js";
import { Volume } from './modules/volume/volume.js';
import { Bar } from './modules/bar/bar.js';
import DirectoryMonitorService from "./directoryMonitorService.js";

const applyScss = () => {
  // Compile scss
  exec(`sass ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
  exec(`sass ${App.configDir}/scss/highlight.scss ${App.configDir}/highlight.css`);
  console.log("Scss compiled");

  // Apply compiled css
  App.resetCss();
  App.applyCss(`${App.configDir}/style.css`);
  console.log("Compiled css applied");
};

DirectoryMonitorService.connect("changed", () => applyScss());

applyScss();


export default {
  style: `${App.configDir}/style.css`,
  closeWindowDelay: {
    sideright: 350,
    launcher: 350,
    bar0: 350,
  },
};
// const win = Widget.Window({
//   name: "volumeModule",
//   child: Volume(),
// });

App.config({
  windows: [
    // win,
    Bar(0),
    Bar(1),
    Bar(2),
  ],
});
