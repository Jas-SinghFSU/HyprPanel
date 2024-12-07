import DropdownMenu from '../shared/dropdown/index.js';
import { Profile } from './profile/index.js';
import { Shortcuts } from './shortcuts/index.js';
// import { Controls } from './controls/index.js';
// import { Stats } from './stats/index.js';
// import { Directories } from './directories/index.js';
import options from 'src/options.js';
import { bind } from 'astal/binding.js';
import Variable from 'astal/variable.js';

const { controls, shortcuts, stats, directories } = options.menus.dashboard;
const { transition } = options.menus;

export default (): JSX.Element => {
    return (
        <DropdownMenu
            name={'dashboardmenu'}
            transition={bind(transition)}
            child={
                <box className={'dashboard-menu-content'} css={'padding: 1px; margin: -1px;'} vexpand={false}>
                    {Variable.derive(
                        [
                            bind(controls.enabled),
                            bind(shortcuts.enabled),
                            bind(stats.enabled),
                            bind(directories.enabled),
                        ],
                        (isControlsEnabled, isShortcutsEnabled, isStatsEnabled, isDirectoriesEnabled) => {
                            return [
                                <box className={'dashboard-content-container'} vertical>
                                    <box className={'dashboard-content-items'} vertical>
                                        <Profile />
                                        <Shortcuts isEnabled={isShortcutsEnabled} />
                                        {/* {isControlsEnabled ? <Controls /> : null} */}
                                        {/* {isDirectoriesEnabled ? <Directories /> : null} */}
                                        {/* {isStatsEnabled ? <Stats /> : null} */}
                                    </box>
                                </box>,
                            ];
                        },
                    )()}
                </box>
            }
        />
    );
};
