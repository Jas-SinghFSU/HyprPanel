import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const OsdTheme = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'osd-theme-page paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('On Screen Display Settings'),
                Option({
                    opt: options.theme.osd.opacity,
                    title: 'OSD Opacity',
                    type: 'number',
                    increment: 5,
                    min: 0,
                    max: 100,
                }),
                Option({ opt: options.theme.osd.bar_color, title: 'Bar', type: 'color' }),
                Option({
                    opt: options.theme.osd.bar_overflow_color,
                    title: 'Bar Overflow',
                    subtitle: 'Overflow color is for when the volume goes over a 100',
                    type: 'color',
                }),
                Option({ opt: options.theme.osd.bar_empty_color, title: 'Bar Background', type: 'color' }),
                Option({ opt: options.theme.osd.bar_container, title: 'Bar Container', type: 'color' }),
                Option({ opt: options.theme.osd.icon, title: 'Icon', type: 'color' }),
                Option({ opt: options.theme.osd.icon_container, title: 'Icon Container', type: 'color' }),
                Option({ opt: options.theme.osd.label, title: 'Value Text', type: 'color' }),
            ],
        }),
    });
};
