import { TodayIcon } from './icon/index.js';
import { TodayStats } from './stats/index.js';
import { TodayTemperature } from './temperature/index.js';
import { HourlyTemperature } from './hourly/index.js';
import Separator from 'src/components/shared/Separator.js';
import { bind } from 'astal';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';
import DropdownMenu from '../shared/dropdown/index.js';
import options from 'src/options.js';

export default (): JSX.Element => {
    return (
        <DropdownMenu
            name="weatherdropdownmenu"
            transition={bind(options.menus.transition).as((transition) => RevealerTransitionMap[transition])}
        >
            <box className={'calendar-menu-item-container weather'}>
                <box className={'weather-container-box'}>
                    <box vertical hexpand>
                        <box className={'calendar-menu-weather today'} hexpand>
                            <TodayIcon />
                            <TodayTemperature />
                            <TodayStats />
                        </box>
                        <Separator className={'menu-separator weather'} />
                        <HourlyTemperature />
                    </box>
                </box>
            </box>
        </DropdownMenu>
    );
};
