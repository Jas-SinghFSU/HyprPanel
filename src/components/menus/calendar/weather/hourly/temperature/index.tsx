import { bind, Variable } from 'astal';
import options from 'src/configuration';
import WeatherService from 'src/services/weather';
import { getTargetHour } from '../helpers';

const weatherService = WeatherService.getInstance();

const { unit } = options.menus.clock.weather;

export const HourlyTemp = ({ hoursFromNow }: HourlyTempProps): JSX.Element => {
    const weatherBinding = Variable.derive(
        [bind(weatherService.weatherData), bind(unit)],
        (weather, unitType) => {
            if (!Object.keys(weather).length || !weather?.forecast?.[0]?.hourly) {
                return '-';
            }

            const targetHour = getTargetHour(new Date(), hoursFromNow);
            const weatherAtTargetHour = weather.forecast[0].hourly.find(
                (h) => h.time.getTime() === targetHour.getTime(),
            );

            if (unitType === 'imperial') {
                // FIX: Convert to F
                return `${weatherAtTargetHour ? Math.ceil(weatherAtTargetHour.temperature) : '-'}° F`;
            }
            return `${weatherAtTargetHour ? Math.ceil(weatherAtTargetHour.temperature) : '-'}° C`;
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
