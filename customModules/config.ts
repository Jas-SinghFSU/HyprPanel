import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const CustomModuleSettings = () => {
    return Widget.Scrollable({
        vscroll: "automatic",
        child: Widget.Box({
            class_name: "bar-theme-page custom-modules",
            vertical: true,
            children: [
                Header('General'),
                Option({ opt: options.theme.bar.buttons.modules.scrollSpeed, title: 'Scrolling Speed', type: 'number' }),

                Header('RAM'),
                Option({ opt: options.bar.customModules.ram.label, title: 'Show Label', type: 'boolean' }),
                Option({ opt: options.theme.bar.buttons.modules.ram.spacing, title: 'Spacing', type: 'string' }),
                Option({ opt: options.bar.customModules.ram.labelType, title: 'Label Type', type: 'enum', enums: ['mem/total', 'memory', 'percentage'] }),
                Option({ opt: options.bar.customModules.ram.round, title: 'Round', type: 'boolean' }),
                Option({ opt: options.bar.customModules.ram.leftClick, title: 'Left Click', type: 'string' }),
                Option({ opt: options.bar.customModules.ram.rightClick, title: 'Right Click', type: 'string' }),
                Option({ opt: options.bar.customModules.ram.middleClick, title: 'Middle Click', type: 'string' }),
                Option({ opt: options.bar.customModules.ram.scrollUp, title: 'Scroll Up', type: 'string' }),
                Option({ opt: options.bar.customModules.ram.scrollDown, title: 'Scroll Down', type: 'string' }),
            ]
        })
    })
}

