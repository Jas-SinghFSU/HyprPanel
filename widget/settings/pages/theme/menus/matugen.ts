import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const Matugen = () => {
    return Widget.Scrollable({
        vscroll: "automatic",
        hscroll: "automatic",
        class_name: "menu-theme-page paged-container",
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Matugen Settings'),
                Option({ opt: options.theme.matugen, title: 'Enable Matugen', subtitle: 'WARNING: THIS WILL REPLACE YOUR CURRENT COLOR SCHEME!!!', type: 'boolean' }),
                Option({ opt: options.theme.matugen_settings.mode, title: 'Matugen Theme', type: 'enum', enums: ["light", "dark"] }),
                Option({
                    opt: options.theme.matugen_settings.scheme_type,
                    title: 'Matugen Scheme',
                    type: 'enum',
                    enums: [
                        "content",
                        "expressive",
                        "fidelity",
                        "fruit-salad",
                        "monochrome",
                        "neutral",
                        "rainbow",
                        "tonal-spot"
                    ]
                }),
                Option({ opt: options.theme.matugen_settings.contrast, title: 'Contrast', subtitle: 'Range: -1 to 1 (Default: 0)', type: 'float' }),
            ]
        })
    })
}
