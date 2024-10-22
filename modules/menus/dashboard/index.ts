import DropdownMenu from '../shared/dropdown/index.js';
import { Profile } from './profile/index.js';
import { Shortcuts } from './shortcuts/index.js';
import { Controls } from './controls/index.js';
import { Stats } from './stats/index.js';
import { Directories } from './directories/index.js';
import Window from 'types/widgets/window.js';
import { Attribute, Child } from 'lib/types/widget.js';
import options from 'options.js';

const { controls, shortcuts, stats, directories } = options.menus.dashboard;

export default (): Window<Child, Attribute> => {
    return DropdownMenu({
        name: 'dashboardmenu',
        transition: options.menus.transition.bind('value'),
        child: Widget.Box({
            class_name: 'dashboard-menu-content',
            css: 'padding: 1px; margin: -1px;',
            vexpand: false,
            children: [
                Widget.Box({
                    class_name: 'dashboard-content-container',
                    vertical: true,
                    children: Utils.merge(
                        [
                            controls.enabled.bind('value'),
                            shortcuts.enabled.bind('value'),
                            stats.enabled.bind('value'),
                            directories.enabled.bind('value'),
                        ],
                        (isControlsEnabled, isShortcutsEnabled, isStatsEnabled, isDirectoriesEnabled) => {
                            return [
                                Widget.Box({
                                    class_name: 'dashboard-content-items',
                                    vertical: true,
                                    children: [
                                        Profile(),
                                        ...(isShortcutsEnabled ? [Shortcuts()] : []),
                                        ...(isControlsEnabled ? [Controls()] : []),
                                        ...(isDirectoriesEnabled ? [Directories()] : []),
                                        ...(isStatsEnabled ? [Stats()] : []),
                                    ],
                                }),
                            ];
                        },
                    ),
                }),
            ],
        }),
    });
};
