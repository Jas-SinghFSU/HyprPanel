import DropdownMenu from '../shared/dropdown/index.js';
import { TimeWidget } from './time/index';
import { CalendarWidget } from './CalendarWidget.js';
import { WeatherWidget } from './weather/index';
import { bind } from 'astal';
import { RevealerTransitionMap } from 'src/components/settings/constants.js';
import options from 'src/configuration';

const { transition } = options.menus;
const { enabled: weatherEnabled } = options.menus.clock.weather;

export default (): JSX.Element => {
    return (
        <DropdownMenu
            name={'calendarmenu'}
            transition={bind(transition).as((transition) => RevealerTransitionMap[transition])}
        >
            <box css={'padding: 1px; margin: -1px;'}>
                {bind(weatherEnabled).as((isWeatherEnabled) => {
                    return (
                        <box className={'calendar-menu-content'} vexpand={false}>
                            <box className={'calendar-content-container'} vertical>
                                <box className={'calendar-content-items'} vertical>
                                    <TimeWidget />
                                    <CalendarWidget />
                                    <WeatherWidget isEnabled={isWeatherEnabled} />
                                </box>
                            </box>
                        </box>
                    );
                })}
            </box>
        </DropdownMenu>
    );
};
