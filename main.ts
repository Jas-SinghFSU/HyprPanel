import "lib/session";
import "scss/style";
import "globals/useTheme";
import "globals/mousePos";

import { Bar } from "modules/bar/Bar";
import MenuWindows from "./modules/menus/main.js";
import SettingsDialog from "widget/settings/SettingsDialog";
import { forMonitors } from "lib/utils";
import OSD from "modules/osd/index";

App.config({
    onConfigParsed: () => Utils.execAsync(`python3 ${App.configDir}/services/bluetooth.py`),
    windows: [
        ...MenuWindows,
        SettingsDialog(),
        ...forMonitors(Bar),
        OSD(),
    ],
    closeWindowDelay: {
        sideright: 350,
        launcher: 350,
        bar0: 350,
    },
})
