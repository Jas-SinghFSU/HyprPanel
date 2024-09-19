import options from 'options';
import { UnitType, Weather, WeatherIconTitle, WeatherIcon } from 'lib/types/weather.js';
import { DEFAULT_WEATHER } from 'lib/types/defaults/weather.js';
import GLib from 'gi://GLib?version=2.0';
import { weatherIcons } from 'modules/icons/weather.js';

const { key, interval, location } = options.menus.clock.weather;

export const globalWeatherVar = Variable<Weather>(DEFAULT_WEATHER);

let weatherIntervalInstance: null | number = null;

const weatherIntervalFn = (weatherInterval: number, loc: string, weatherKey: string): void => {
    if (weatherIntervalInstance !== null) {
        GLib.source_remove(weatherIntervalInstance);
    }

    const formattedLocation = loc.replace(' ', '%20');

    weatherIntervalInstance = Utils.interval(weatherInterval, () => {
        Utils.execAsync(
            `curl "https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${formattedLocation}&days=1&aqi=no&alerts=no"`,
        )
            .then((res) => {
                try {
                    if (typeof res !== 'string') {
                        return (globalWeatherVar.value = DEFAULT_WEATHER);
                    }

                    const parsedWeather = JSON.parse(res);

                    if (Object.keys(parsedWeather).includes('error')) {
                        return (globalWeatherVar.value = DEFAULT_WEATHER);
                    }

                    return (globalWeatherVar.value = parsedWeather);
                } catch (error) {
                    globalWeatherVar.value = DEFAULT_WEATHER;
                    console.warn(`Failed to parse weather data: ${error}`);
                }
            })
            .catch((err) => {
                console.error(`Failed to fetch weather: ${err}`);
                globalWeatherVar.value = DEFAULT_WEATHER;
            });
    });
};

Utils.merge([key.bind('value'), interval.bind('value'), location.bind('value')], (weatherKey, weatherInterval, loc) => {
    if (!weatherKey) {
        return (globalWeatherVar.value = DEFAULT_WEATHER);
    }
    weatherIntervalFn(weatherInterval, loc, weatherKey);
});

export const getTemperature = (wthr: Weather, unt: UnitType): string => {
    if (unt === 'imperial') {
        return `${Math.ceil(wthr.current.temp_f)}° F`;
    } else {
        return `${Math.ceil(wthr.current.temp_c)}° C`;
    }
};

export const getWeatherIcon = (fahren: number): Record<string, string> => {
    const icons = {
        100: '',
        75: '',
        50: '',
        25: '',
        0: '',
    } as const;
    const colors = {
        100: 'weather-color red',
        75: 'weather-color orange',
        50: 'weather-color lavender',
        25: 'weather-color blue',
        0: 'weather-color sky',
    } as const;

    type IconKeys = keyof typeof icons;

    const threshold: IconKeys =
        fahren < 0 ? 0 : ([100, 75, 50, 25, 0] as IconKeys[]).find((threshold) => threshold <= fahren) || 0;

    const icon = icons[threshold || 50];
    const color = colors[threshold || 50];

    return {
        icon,
        color,
    };
};

export const getWindConditions = (wthr: Weather, unt: UnitType): string => {
    if (unt === 'imperial') {
        return `${Math.floor(wthr.current.wind_mph)} mph`;
    }
    return `${Math.floor(wthr.current.wind_kph)} kph`;
};

export const getRainChance = (wthr: Weather): string => `${wthr.forecast.forecastday[0].day.daily_chance_of_rain}%`;

export const isValidWeatherIconTitle = (title: string): title is WeatherIconTitle => {
    return title in weatherIcons;
};

export const getWeatherStatusTextIcon = (wthr: Weather): WeatherIcon => {
    let iconQuery = wthr.current.condition.text.trim().toLowerCase().replaceAll(' ', '_');

    if (!wthr.current.is_day && iconQuery === 'partly_cloudy') {
        iconQuery = 'partly_cloudy_night';
    }

    if (isValidWeatherIconTitle(iconQuery)) {
        return weatherIcons[iconQuery];
    } else {
        console.warn(`Unknown weather icon title: ${iconQuery}`);
        return weatherIcons['warning'];
    }
};

globalThis['globalWeatherVar'] = globalWeatherVar;
