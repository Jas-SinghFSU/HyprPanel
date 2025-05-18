import { getNextEpoch } from '../helpers';
import { bind } from 'astal';
import WeatherManager from 'src/shared/weather';

const weatherManager = WeatherManager.get_default();

export const HourlyTime = ({ hoursFromNow }: HourlyTimeProps): JSX.Element => {
    return (
        <label
            className={'hourly-weather-time'}
            label={bind(weatherManager.weatherData).as((weather) => {
                if (!Object.keys(weather).length) {
                    return '-';
                }

                const nextEpoch = getNextEpoch(weather, hoursFromNow);
                const dateAtEpoch = new Date(nextEpoch * 1000);

                let hours = dateAtEpoch.getHours();
                const ampm = hours >= 12 ? 'PM' : 'AM';

                hours = hours % 12 || 12;

                return `${hours}${ampm}`;
            })}
        />
    );
};

interface HourlyTimeProps {
    hoursFromNow: number;
}
