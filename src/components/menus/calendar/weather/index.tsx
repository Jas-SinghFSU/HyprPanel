import { TodayIcon } from './icon/index.js';
import { TodayStats } from './stats/index.js';
import { TodayTemperature } from './temperature/index.js';
import { HourlyTemperature } from './hourly/index.js';
import Separator from 'src/components/shared/Separator.js';

export const WeatherWidget = ({ isEnabled }: WeatherWidgetProps): JSX.Element => {
    if (!isEnabled) {
        return <box />;
    }

    return (
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
    );
};

interface WeatherWidgetProps {
    isEnabled: boolean;
}
