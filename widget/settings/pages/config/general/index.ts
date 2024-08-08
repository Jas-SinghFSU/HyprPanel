import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const BarGeneral = () => {
    return Widget.Box({
        class_name: "bar-theme-page paged-container",
        vertical: true,
        children: [
            Header('General Settings'),
            Option({ opt: options.theme.font.name, title: 'Font', type: 'font' }),
            Option({ opt: options.theme.font.size, title: 'Font Size', type: 'string' }),
            Option({ opt: options.theme.font.weight, title: 'Font Weight', subtitle: "100, 200, 300, etc.", type: 'number', increment: 100, min: 100, max: 900 }),
            Option({ opt: options.terminal, title: 'Terminal', subtitle: "Tools such as 'btop' will open in this terminal", type: 'string' }),

            Header('On Screen Display'),
            Option({ opt: options.theme.osd.enable, title: 'Enabled', type: 'boolean' }),
            Option({ opt: options.theme.osd.orientation, title: 'Orientation', type: 'enum', enums: ["horizontal", "vertical"] }),
            Option({ opt: options.theme.osd.location, title: 'Position', subtitle: 'Position of the OSD on the screen', type: 'enum', enums: ["top left", "top", "top right", "right", "bottom right", "bottom", "bottom left", "left"] }),
            Option({ opt: options.theme.osd.monitor, title: 'Monitor', subtitle: 'The ID of the monitor on which to display the OSD', type: 'number' }),
            Option({ opt: options.theme.osd.active_monitor, title: 'Follow Cursor', subtitle: 'The OSD will follow the monitor of your cursor', type: 'boolean' }),
            Option({ opt: options.theme.osd.radius, title: 'Radius', subtitle: 'Radius of the on-screen-display that indicates volume/brightness change', type: 'string' }),
            Option({ opt: options.theme.osd.margins, title: 'Margins', subtitle: 'Margins in the following format: top right bottom left', type: 'string' }),
        ]
    })
}
