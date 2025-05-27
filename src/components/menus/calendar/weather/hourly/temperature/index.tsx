import { bind, Variable } from 'astal';
import options from 'src/configuration';
import WeatherService from 'src/services/weather';
import { getTargetHour } from '../helpers';
import { TemperatureConverter } from 'src/lib/units/temperature';

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
            const temperatureAtTargetHour = weatherAtTargetHour?.temperature ?? 0;

            const tempConverter = TemperatureConverter.fromCelsius(temperatureAtTargetHour);
            const isImperial = unitType === 'imperial';

            return isImperial ? tempConverter.formatFahrenheit() : tempConverter.formatCelsius();
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
