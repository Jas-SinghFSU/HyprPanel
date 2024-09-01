import { Option } from "widget/settings/shared/Option";
import { Header } from "widget/settings/shared/Header";

import options from "options";

export const CustomModuleTheme = () => {
    return Widget.Scrollable({
        vscroll: "automatic",
        child: Widget.Box({
            class_name: "bar-theme-page paged-container",
            vertical: true,
            children: [
                Header('RAM'),
                Option({ opt: options.theme.bar.buttons.modules.ram.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.ram.icon, title: 'Icon', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.ram.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.ram.hover, title: 'Hover', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.ram.icon_background,
                    title: 'Icon Background',
                    subtitle: 'Applies a background color to the icon section of the button.\nRequires \'split\' button styling.',
                    type: 'color'
                }),

                Header('CPU'),
                Option({ opt: options.theme.bar.buttons.modules.cpu.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.cpu.icon, title: 'Icon', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.cpu.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.cpu.hover, title: 'Hover', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.cpu.icon_background,
                    title: 'Icon Background',
                    subtitle: 'Applies a background color to the icon section of the button.\nRequires \'split\' button styling.',
                    type: 'color'
                }),

                Header('Storage'),
                Option({ opt: options.theme.bar.buttons.modules.storage.text, title: 'Text', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.storage.icon, title: 'Icon', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.storage.background, title: 'Background', type: 'color' }),
                Option({ opt: options.theme.bar.buttons.modules.storage.hover, title: 'Hover', type: 'color' }),
                Option({
                    opt: options.theme.bar.buttons.modules.storage.icon_background,
                    title: 'Icon Background',
                    subtitle: 'Applies a background color to the icon section of the button.\nRequires \'split\' button styling.',
                    type: 'color'
                }),
            ]
        })
    })
}


