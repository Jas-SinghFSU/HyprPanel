import { AstalIO, bind, execAsync, interval, Variable } from 'astal';
import { DEFAULT_WEATHER } from 'src/lib/types/defaults/weather.types';
import { UnitType, Weather, WeatherIcon, WeatherIconTitle } from 'src/lib/types/weather.types';
import { WeatherApiKeyManager } from './KeyManager';
import options from 'src/options';
import { Opt } from 'src/lib/options';
import { weatherIcons } from 'src/lib/icons/weather';

export default class WeatherManager {
    public static instance: WeatherManager;

    public weatherData: Variable<Weather> = Variable(DEFAULT_WEATHER);

    private readonly _location: Opt<string>;

    private readonly _intervalFrequency: Opt<number>;
    private _interval: null | AstalIO.Time = null;

    constructor() {
        const { interval, location } = options.menus.clock.weather;

        this._intervalFrequency = interval;
        this._location = location;

        this._initializeConfigTracker();
    }

    public static get_default(): WeatherManager {
        if (WeatherManager.instance === undefined) {
            WeatherManager.instance = new WeatherManager();
        }
        return WeatherManager.instance;
    }

    private _initializeConfigTracker(): void {
        const weatherKeyManager = new WeatherApiKeyManager();

        Variable.derive(
            [bind(weatherKeyManager.weatherApiKey), bind(this._intervalFrequency), bind(this._location)],
            (weatherKey, weatherInterval, loc) => {
                if (!weatherKey) {
                    return this.weatherData.set(DEFAULT_WEATHER);
                }

                this._initializeWeatherPolling(weatherInterval, loc, weatherKey);
            },
        )();
    }

    /**
     * Sets up a weather update interval function.
     *
     * @param weatherInterval - The interval in milliseconds at which to fetch weather updates.
     * @param loc - The location for which to fetch weather data.
     * @param weatherKey - The API key for accessing the weather service.
     */
    private _initializeWeatherPolling(weatherInterval: number, loc: string, weatherKey: string): void {
        if (this._interval !== null) {
            this._interval.cancel();
        }

        const formattedLocation = loc.replaceAll(' ', '%20');

        this._interval = interval(weatherInterval, async () => {
            execAsync(
                `curl "https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=${formattedLocation}&days=1&aqi=no&alerts=no"`,
            )
                .then((weatherResponse) => {
                    try {
                        if (typeof weatherResponse !== 'string') {
                            return this.weatherData.set(DEFAULT_WEATHER);
                        }

                        const parsedWeather = JSON.parse(weatherResponse);

                        if (Object.keys(parsedWeather).includes('error')) {
                            return this.weatherData.set(DEFAULT_WEATHER);
                        }

                        return this.weatherData.set(parsedWeather);
                    } catch (error) {
                        this.weatherData.set(DEFAULT_WEATHER);
                        console.warn(`Failed to parse weather data: ${error}`);
                    }
                })
                .catch((err) => {
                    console.error(`Failed to fetch weather: ${err}`);
                    this.weatherData.set(DEFAULT_WEATHER);
                });
        });
    }

    /**
     * Gets the temperature from the weather data in the specified unit.
     *
     * @param weatherData - The weather data object.
     * @param unitType - The unit type, either 'imperial' or 'metric'.
     * @returns - The temperature formatted as a string with the appropriate unit.
     */
    public getTemperature(weatherData: Weather, unitType: UnitType): string {
        if (unitType === 'imperial') {
            return `${Math.ceil(weatherData.current.temp_f)}° F`;
        } else {
            return `${Math.ceil(weatherData.current.temp_c)}° C`;
        }
    }

    /**
     * Returns the appropriate weather icon and color class based on the temperature in Fahrenheit.
     *
     * @param fahrenheit - The temperature in Fahrenheit.
     * @returns - An object containing the weather icon and color class.
     */
    public getWeatherIcon(fahrenheit: number): Record<string, string> {
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
            fahrenheit < 0
                ? 0
                : (([100, 75, 50, 25, 0] as IconKeys[]).find((threshold) => threshold <= fahrenheit) ?? 0);

        const icon = icons[threshold || 50];
        const color = colors[threshold || 50];

        return {
            icon,
            color,
        };
    }

    /**
     * Gets the wind conditions from the weather data in the specified unit.
     *
     * @param weatherData - The weather data object.
     * @param unitType - The unit type, either 'imperial' or 'metric'.
     * @returns - The wind conditions formatted as a string with the appropriate unit.
     */
    public getWindConditions(weatherData: Weather, unitType: UnitType): string {
        if (unitType === 'imperial') {
            return `${Math.floor(weatherData.current.wind_mph)} mph`;
        }
        return `${Math.floor(weatherData.current.wind_kph)} kph`;
    }

    /**
     * Gets the chance of rain from the weather forecast data.
     *
     * @param weatherData - The weather data object.
     * @returns - The chance of rain formatted as a percentage string.
     */
    public getRainChance(weatherData: Weather): string {
        return `${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    }

    /**
     * Type Guard
     * Checks if the given title is a valid weather icon title.
     *
     * @param title - The weather icon title to check.
     * @returns - True if the title is a valid weather icon title, false otherwise.
     */
    public isValidWeatherIconTitle(title: string): title is WeatherIconTitle {
        return title in weatherIcons;
    }

    /**
     * Gets the appropriate weather icon based on the weather status text.
     *
     * @param weatherData - The weather data object.
     * @returns - The weather icon corresponding to the weather status text.
     */
    public getWeatherStatusTextIcon(weatherData: Weather): WeatherIcon {
        let iconQuery = weatherData.current.condition.text.trim().toLowerCase().replaceAll(' ', '_');

        if (!weatherData.current.is_day && iconQuery === 'partly_cloudy') {
            iconQuery = 'partly_cloudy_night';
        }

        if (this.isValidWeatherIconTitle(iconQuery)) {
            return weatherIcons[iconQuery];
        } else {
            console.warn(`Unknown weather icon title: ${iconQuery}`);
            return weatherIcons['warning'];
        }
    }

    public convertCelsiusToFahrenheit(celsiusValue: number): number {
        return (celsiusValue * 9) / 5 + 32;
    }
}
