import { AstalIO, bind, interval, Variable } from 'astal';
import { getWeatherProvider } from 'src/services/weather/providers/registry';
import { WeatherApiKeyManager } from './keyManager';
import options from 'src/configuration';
import { Opt } from 'src/lib/options';
import { weatherIcons } from 'src/services/weather/icons';
import { httpClient } from 'src/lib/httpClient';
import { Weather } from './providers/core.types';
import { WeatherIconTitle, WeatherIcon } from './types';
import { DEFAULT_WEATHER } from 'src/services/weather/default';
import { UnitType } from 'src/lib/formatters/temperature/types';

export default class WeatherService {
    public static instance: WeatherService;

    public weatherData: Variable<Weather> = Variable(DEFAULT_WEATHER);
    private _currentProvider = 'weatherapi';

    private readonly _location: Opt<string>;

    private readonly _intervalFrequency: Opt<number>;
    private _interval: null | AstalIO.Time = null;

    constructor() {
        const { interval, location } = options.menus.clock.weather;

        this._intervalFrequency = interval;
        this._location = location;

        this._initializeConfigTracker();
    }

    public static get_default(): WeatherService {
        if (WeatherService.instance === undefined) {
            WeatherService.instance = new WeatherService();
        }
        return WeatherService.instance;
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
     * @param weatherInterval The interval in milliseconds at which to fetch weather updates
     * @param loc The location for which to fetch weather data
     * @param weatherKey The API key for accessing the weather service
     */
    private _initializeWeatherPolling(weatherInterval: number, loc: string, weatherKey: string): void {
        if (this._interval !== null) {
            this._interval.cancel();
        }

        const provider = getWeatherProvider(this._currentProvider);
        if (!provider) {
            console.error(`Weather provider '${this._currentProvider}' not found`);
            return;
        }

        const formattedLocation = loc.replaceAll(' ', '%20');
        const url =
            provider.formatUrl?.(formattedLocation, weatherKey) ||
            `${provider.baseUrl}?location=${formattedLocation}&key=${weatherKey}`;

        this._interval = interval(weatherInterval, async () => {
            try {
                const response = await httpClient.get(url);

                if (response.data && provider.adapter) {
                    const transformedData = provider.adapter.toGenericFormat(response.data);
                    this.weatherData.set(transformedData);
                } else {
                    this.weatherData.set(DEFAULT_WEATHER);
                }
            } catch (error) {
                console.error(`Failed to fetch weather from ${provider.name}: ${error}`);
                this.weatherData.set(DEFAULT_WEATHER);
            }
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
        if (!weatherData?.current?.temperature) {
            return '--° --';
        }

        if (unitType === 'imperial') {
            return `${Math.ceil(weatherData.current.temperature.fahrenheit)}° F`;
        } else {
            return `${Math.ceil(weatherData.current.temperature.celsius)}° C`;
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
        if (!weatherData?.current?.wind) {
            return '-- mph';
        }

        if (unitType === 'imperial') {
            return `${Math.floor(weatherData.current.wind.speedMph)} mph`;
        }
        return `${Math.floor(weatherData.current.wind.speedKph)} kph`;
    }

    /**
     * Gets the chance of rain from the weather forecast data.
     *
     * @param weatherData - The weather data object.
     * @returns - The chance of rain formatted as a percentage string.
     */
    public getRainChance(weatherData: Weather): string {
        if (!weatherData?.forecast?.[0]?.chanceOfRain) {
            return '--%';
        }
        return `${weatherData.forecast[0].chanceOfRain}%`;
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
        if (!weatherData?.current?.condition?.text) {
            return weatherIcons.warning;
        }

        let iconQuery = weatherData.current.condition.text.trim().toLowerCase().replaceAll(' ', '_');

        if (!weatherData.current.condition.isDay && iconQuery === 'partly_cloudy') {
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

    /**
     * Changes the active weather provider
     *
     * @param providerId Provider identifier (e.g., 'weatherapi', 'openweathermap')
     */
    public setProvider(providerId: string): void {
        const provider = getWeatherProvider(providerId);
        if (!provider) {
            throw new Error(`Weather provider '${providerId}' not found`);
        }
        this._currentProvider = providerId;

        const weatherKeyManager = new WeatherApiKeyManager();
        const weatherKey = weatherKeyManager.weatherApiKey.get();
        if (weatherKey && this._location.get()) {
            this._initializeWeatherPolling(this._intervalFrequency.get(), this._location.get(), weatherKey);
        }
    }
}
