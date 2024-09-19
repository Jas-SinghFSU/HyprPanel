import { Option } from 'widget/settings/shared/Option';
import { Header } from 'widget/settings/shared/Header';

import options from 'options';
import Scrollable from 'types/widgets/scrollable';
import { Attribute, Child } from 'lib/types/widget';

export const Matugen = (): Scrollable<Child, Attribute> => {
    return Widget.Scrollable({
        vscroll: 'automatic',
        hscroll: 'automatic',
        class_name: 'menu-theme-page paged-container',
        vexpand: true,
        child: Widget.Box({
            vertical: true,
            children: [
                Header('Matugen Settings'),
                Option({
                    opt: options.theme.matugen,
                    title: 'Enable Matugen',
                    subtitle: 'WARNING: THIS WILL REPLACE YOUR CURRENT COLOR SCHEME!!!',
                    type: 'boolean',
                    dependencies: ['matugen', 'swww'],
                }),
                Option({
                    opt: options.theme.matugen_settings.mode,
                    title: 'Matugen Theme',
                    type: 'enum',
                    enums: ['light', 'dark'],
                }),
                Option({
                    opt: options.theme.matugen_settings.scheme_type,
                    title: 'Matugen Scheme',
                    type: 'enum',
                    enums: [
                        'content',
                        'expressive',
                        'fidelity',
                        'fruit-salad',
                        'monochrome',
                        'neutral',
                        'rainbow',
                        'tonal-spot',
                    ],
                }),
                Option({
                    opt: options.theme.matugen_settings.variation,
                    title: 'Matugen Variation',
                    type: 'enum',
                    enums: [
                        'standard_1',
                        'standard_2',
                        'standard_3',
                        'monochrome_1',
                        'monochrome_2',
                        'monochrome_3',
                        'vivid_1',
                        'vivid_2',
                        'vivid_3',
                    ],
                }),
                Option({
                    opt: options.theme.matugen_settings.contrast,
                    title: 'Contrast',
                    subtitle: 'Range: -1 to 1 (Default: 0)',
                    type: 'float',
                }),
            ],
        }),
    });
};
