import { Weather, WeatherIconTitle } from 'lib/types/weather.js';
import { Variable } from 'types/variable.js';
import { weatherIcons } from 'modules/icons/weather.js';
import { isValidWeatherIconTitle } from 'globals/weather';
import { BoxWidget } from 'lib/types/widget';

export const HourlyIcon = (theWeather: Variable<Weather>, getNextEpoch: (wthr: Weather) => number): BoxWidget => {
    const getIconQuery = (wthr: Weather): WeatherIconTitle => {
        const nextEpoch = getNextEpoch(wthr);
        const weatherAtEpoch = wthr.forecast.forecastday[0].hour.find((h) => h.time_epoch === nextEpoch);

        if (weatherAtEpoch === undefined) {
            return 'warning';
        }

        let iconQuery = weatherAtEpoch.condition.text.trim().toLowerCase().replaceAll(' ', '_');

        if (!weatherAtEpoch?.is_day && iconQuery === 'partly_cloudy') {
            iconQuery = 'partly_cloudy_night';
        }

        if (isValidWeatherIconTitle(iconQuery)) {
            return iconQuery;
        } else {
            return 'warning';
        }
    };

    return Widget.Box({
        hpack: 'center',
        child: theWeather.bind('value').as((w) => {
            const iconQuery = getIconQuery(w);
            const weatherIcn = weatherIcons[iconQuery] || weatherIcons['warning'];

            return Widget.Label({
                hpack: 'center',
                class_name: 'hourly-weather-icon txt-icon',
                label: weatherIcn,
            });
        }),
    });
};
