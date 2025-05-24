import { getNextEpoch } from '../helpers';
import { bind, Variable } from 'astal';
import options from 'src/configuration';
import WeatherService from 'src/services/weather';

const weatherService = WeatherService.getInstance();
const { military } = options.menus.clock.time;

export const HourlyTime = ({ hoursFromNow }: HourlyTimeProps): JSX.Element => {
    const weatherBinding = Variable.derive(
        [bind(weatherService.weatherData), bind(military)],
        (weather, military) => {
            if (!Object.keys(weather).length) {
                return '-';
            }

            const nextEpoch = getNextEpoch(weather, hoursFromNow);
            const dateAtEpoch = new Date(nextEpoch * 1000);

            let hours = dateAtEpoch.getHours();

            if (military) {
                return `${hours}:00`;
            }

            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}${ampm}`;
        },
    );

    return (
        <label
            className={'hourly-weather-time'}
            label={weatherBinding()}
            onDestroy={() => {
                weatherBinding.drop();
            }}
        />
    );
};

interface HourlyTimeProps {
    hoursFromNow: number;
}
