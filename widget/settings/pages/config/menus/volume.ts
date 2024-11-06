import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const VolumeMenuSettings = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        child: Widget.Box({
            class_name: 'bar-theme-page paged-container',
            vertical: true,
            children: [
                Header('Volume'),
                Option({
                    opt: options.menus.volume.raiseMaximumVolume,
                    title: 'Allow Raising Volume Above 100%',
                    subtitle: 'Allows the volume slider in the menu to go up to 150% volume',
                    type: 'boolean',
                }),
            ],
        }),
    });
};
