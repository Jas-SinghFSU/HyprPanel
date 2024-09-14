import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const OSDSettings = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        child: Widget.Box({
            class_name: 'bar-theme-page paged-container',
            vertical: true,
            children: [
                Header('On Screen Display'),
                Option({ opt: options.theme.osd.enable, title: 'Enabled', type: 'boolean' }),
                Option({
                    opt: options.theme.osd.duration,
                    title: 'Duration',
                    type: 'number',
                    min: 100,
                    max: 10000,
                    increment: 500,
                }),
                Option({
                    opt: options.theme.osd.orientation,
                    title: 'Orientation',
                    type: 'enum',
                    enums: ['horizontal', 'vertical'],
                }),
                Option({
                    opt: options.theme.osd.location,
                    title: 'Position',
                    subtitle: 'Position of the OSD on the screen',
                    type: 'enum',
                    enums: ['top left', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left'],
                }),
                Option({
                    opt: options.theme.osd.monitor,
                    title: 'Monitor',
                    subtitle: 'The ID of the monitor on which to display the OSD',
                    type: 'number',
                }),
                Option({
                    opt: options.theme.osd.active_monitor,
                    title: 'Follow Cursor',
                    subtitle: 'The OSD will follow the monitor of your cursor',
                    type: 'boolean',
                }),
                Option({
                    opt: options.theme.osd.radius,
                    title: 'Radius',
                    subtitle: 'Radius of the on-screen-display that indicates volume/brightness change',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.osd.margins,
                    title: 'Margins',
                    subtitle: 'Margins in the following format: top right bottom left',
                    type: 'string',
                }),
                Option({
                    opt: options.theme.osd.muted_zero,
                    title: 'Mute Volume as Zero',
                    subtitle: 'Display volume as 0 when muting, instead of previous device volume',
                    type: 'boolean',
                }),
            ],
        }),
    });
};
