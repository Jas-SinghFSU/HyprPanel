import { getNextEpoch } from '../helpers';
import { bind, Variable } from 'astal';
import options from 'src/configuration';
import { toEpochTime } from 'src/lib/formatters/time';
import WeatherService from 'src/services/weather';

const weatherService = WeatherService.getInstance();

const { unit } = options.menus.clock.weather;

export const HourlyTemp = ({ hoursFromNow }: HourlyTempProps): JSX.Element => {
    const weatherBinding = Variable.derive(
        [bind(weatherService.weatherData), bind(unit)],
        (weather, unitType) => {
            if (!Object.keys(weather).length || !weather?.forecast?.[0]?.hourly) {
                return '-';
            }

            const nextEpoch = getNextEpoch(weather, hoursFromNow);
            const weatherAtEpoch = weather.forecast[0].hourly.find((h) => toEpochTime(h.time) === nextEpoch);

            if (unitType === 'imperial') {
                // FIX: Convert to F
                return `${weatherAtEpoch ? Math.ceil(weatherAtEpoch.temperature) : '-'}° F`;
            }
            return `${weatherAtEpoch ? Math.ceil(weatherAtEpoch.temperature) : '-'}° C`;
        },
    );

    return (
        <label
            className={'hourly-weather-temp'}
            label={weatherBinding()}
            onDestroy={() => {
                weatherBinding.drop();
            }}
        />
    );
};

interface HourlyTempProps {
    hoursFromNow: number;
}
