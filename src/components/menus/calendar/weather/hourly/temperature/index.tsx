import options from 'src/options';
import { getNextEpoch } from '../helpers';
import { bind, Variable } from 'astal';
import WeatherManager from 'src/services/weather';

const weatherManager = WeatherManager.get_default();

const { unit } = options.menus.clock.weather;

export const HourlyTemp = ({ hoursFromNow }: HourlyTempProps): JSX.Element => {
    const weatherBinding = Variable.derive(
        [bind(weatherManager.weatherData), bind(unit)],
        (weather, unitType) => {
            if (!Object.keys(weather).length) {
                return '-';
            }

            const nextEpoch = getNextEpoch(weather, hoursFromNow);
            const weatherAtEpoch = weather.forecast.forecastday[0].hour.find(
                (h) => h.time_epoch === nextEpoch,
            );

            if (unitType === 'imperial') {
                return `${weatherAtEpoch ? Math.ceil(weatherAtEpoch.temp_f) : '-'}° F`;
            }
            return `${weatherAtEpoch ? Math.ceil(weatherAtEpoch.temp_c) : '-'}° C`;
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
