import GLib from "gi://GLib"

const main = "/tmp/ags/hyprpanel/main.js"
const entry = `${App.configDir}/main.ts`
const bundler = GLib.getenv("AGS_BUNDLER") || "bun"

const v = {
    ags: pkg.version?.split(".").map(Number) || [],
    expect: [1, 8, 1],
}

try {
    switch (bundler) {
        case "bun": await Utils.execAsync([
            "bun", "build", entry,
            "--outfile", main,
            "--external", "resource://*",
            "--external", "gi://*",
            "--external", "file://*",
        ]); break

        case "esbuild": await Utils.execAsync([
            "esbuild", "--bundle", entry,
            "--format=esm",
            `--outfile=${main}`,
            "--external:resource://*",
            "--external:gi://*",
            "--external:file://*",
        ]); break

        default:
            throw `"${bundler}" is not a valid bundler`
    }

    if (v.ags[1] < v.expect[1] || v.ags[2] < v.expect[2]) {
        print(`my config needs at least v${v.expect.join(".")}, yours is v${v.ags.join(".")}`)
        App.quit()
    }

    await import(`file://${main}`)
} catch (error) {
    console.error(error)
    App.quit()
}

export { }
// import { exec } from "resource:///com/github/Aylur/ags/utils.js";
// import { Bar, BarAlt } from "./modules/bar/index.js";
// import DirectoryMonitorService from "./directoryMonitorService.js";
// import MenuWindows from "./modules/menus/main.js";
// import Notifications from "./modules/notifications/index.js";
//
// const applyScss = () => {
//   // Compile scss
//   exec(`sass ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
//   exec(
//     `sass ${App.configDir}/scss/highlight.scss ${App.configDir}/highlight.css`,
//   );
//   console.log("Scss compiled");
//
//   // Apply compiled css
//   App.resetCss();
//   App.applyCss(`${App.configDir}/style.css`);
//   console.log("Compiled css applied");
// };
//
// DirectoryMonitorService.connect("changed", () => applyScss());
//
// applyScss();
//
// const workspaceMonitorMap = {
//   0: [4, 5],
//   1: [6, 7],
//   2: [1, 2, 3, 8, 9, 10],
// };
//
// App.config({
//   windows: [
//     ...MenuWindows,
//     Notifications(),
//     BarAlt(0, workspaceMonitorMap),
//     BarAlt(1, workspaceMonitorMap),
//     Bar(2, workspaceMonitorMap),
//   ],
//   style: `${App.configDir}/style.css`,
//   closeWindowDelay: {
//     sideright: 350,
//     launcher: 350,
//     bar0: 350,
//   },
//   onConfigParsed: () => Utils.execAsync(`python3 ${App.configDir}/services/bluetooth.py`),
// });
