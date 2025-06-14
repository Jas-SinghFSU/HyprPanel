import { AstalIO, bind, interval, Variable } from 'astal';
import { getWeatherProvider } from 'src/services/weather/adapters/registry';
import { WeatherApiKeyManager } from './keyManager';
import options from 'src/configuration';
import { httpClient } from 'src/lib/httpClient';
import { GaugeIcon, Percentage, Weather, WeatherIcon } from './types';
import { DEFAULT_WEATHER } from './default';
import { WeatherProvider } from './adapters/types';
import { TemperatureConverter } from 'src/lib/units/temperature';
import { SpeedConverter } from 'src/lib/units/speed';

const { interval: weatherInterval, location, unit } = options.menus.clock.weather;

/**
 * Service for fetching and managing weather data from various providers
 */
export default class WeatherService {
    public static instance: WeatherService;

    private _currentProvider = 'weatherapi';

    private readonly _location = location;
    private readonly _intervalFrequency = weatherInterval;
    private readonly _unitType = unit;

    private _interval: null | AstalIO.Time = null;

    private _weatherData: Variable<Weather> = Variable(DEFAULT_WEATHER);
    private _temperature: Variable<string> = Variable(this._getTemperature());
    private _rainChance: Variable<Percentage> = Variable(this._getRainChance());
    private _windCondition: Variable<string> = Variable(this._getWindConditions());
    private _statusIcon: Variable<WeatherIcon> = Variable(this._getWeatherStatusIcon());
    private _gaugeIcon: Variable<GaugeIcon> = Variable(this._getGaugeIcon());

    private constructor() {
        this._initializeConfigTracker();
        this._initializeWeatherTracker();
    }

    /**
     * Gets the singleton instance of WeatherService
     *
     * @returns The WeatherService instance
     */
    public static getInstance(): WeatherService {
        if (WeatherService.instance === undefined) {
            WeatherService.instance = new WeatherService();
        }
        return WeatherService.instance;
    }

    /**
     * Changes the active weather provider
     *
     * @param providerId - Provider identifier (e.g., 'weatherapi', 'openweathermap')
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

    /**
     * Gets the complete weather data variable
     *
     * @returns Variable containing all weather information
     */
    public get weatherData(): Variable<Weather> {
        return this._weatherData;
    }

    /**
     * Gets the formatted temperature string variable
     *
     * @returns Variable containing temperature with unit
     */
    public get temperature(): Variable<string> {
        return this._temperature;
    }

    /**
     * Gets the rain probability percentage variable
     *
     * @returns Variable containing rain chance percentage
     */
    public get rainChance(): Variable<Percentage> {
        return this._rainChance;
    }

    /**
     * Gets the formatted wind conditions variable
     *
     * @returns Variable containing wind speed with unit
     */
    public get windCondition(): Variable<string> {
        return this._windCondition;
    }

    /**
     * Gets the weather condition icon variable
     *
     * @returns Variable containing weather icon enum value
     */
    public get statusIcon(): Variable<WeatherIcon> {
        return this._statusIcon;
    }

    /**
     * Gets the temperature gauge icon and color variable
     *
     * @returns Variable containing gauge icon and color class
     */
    public get gaugeIcon(): Variable<GaugeIcon> {
        return this._gaugeIcon;
    }

    /**
     * Gets the temperature from the weather data in the specified unit.
     *
     * @returns - The temperature formatted as a string with the appropriate unit.
     */
    private _getTemperature(): string {
        const { temperature } = this.weatherData.get().current;

        const tempConverter = TemperatureConverter.fromCelsius(temperature);
        const isImperial = this._unitType.get() === 'imperial';

        return isImperial ? tempConverter.formatFahrenheit() : tempConverter.formatCelsius();
    }

    /**
     * Gets the appropriate weather icon for a condition
     *
     * @returns Weather icon
     */
    private _getWeatherStatusIcon(): WeatherIcon {
        const { condition } = this.weatherData.get().current;

        if (condition.text === 'PARTLY CLOUDY NIGHT' && !condition.isDay) {
            return WeatherIcon['PARTLY CLOUDY NIGHT'];
        }

        return WeatherIcon[condition.text] ?? WeatherIcon.WARNING;
    }

    /**
     * Returns the weather gauge icon and color class based on the temperature in Celsius.
     *
     * @returns - An object containing the weather icon and color class.
     */
    private _getGaugeIcon(): GaugeIcon {
        const { temperature } = this.weatherData.get().current;
        const icons = {
            38: '',
            24: '',
            10: '',
            [-4]: '',
            [-18]: '',
        } as const;

        const colors = {
            38: 'weather-color red',
            24: 'weather-color orange',
            10: 'weather-color lavender',
            [-4]: 'weather-color blue',
            [-18]: 'weather-color sky',
        } as const;

        type IconKeys = keyof typeof icons;

        const threshold: IconKeys =
            temperature < -18
                ? -18
                : (([38, 24, 10, -4, -18] as IconKeys[]).find((threshold) => threshold <= temperature) ?? 10);
        const icon = icons[threshold || 10];
        const color = colors[threshold || 10];

        return {
            icon,
            color,
        };
    }

    /**
     * Gets the wind conditions from the weather data in the specified unit.
     *
     * @returns - The wind conditions formatted as a string with the appropriate unit.
     */
    private _getWindConditions(): string {
        const windConditions = this.weatherData.get().current.wind;

        const isImperial = this._unitType.get() === 'imperial';
        const windSpeed = windConditions?.speed ?? 0;
        const speedConverter = SpeedConverter.fromKph(windSpeed);

        return isImperial ? speedConverter.formatMph() : speedConverter.formatKph();
    }

    /**
     * Gets the chance of rain from the weather forecast data.
     *
     * @returns - The chance of rain formatted as a percentage string.
     */
    private _getRainChance(): number {
        const chanceOfRain = this.weatherData.get().current.chanceOfRain;

        if (!chanceOfRain) {
            return 0;
        }

        return chanceOfRain;
    }

    /**
     * Sets up configuration tracking for dynamic weather updates
     */
    private _initializeConfigTracker(): void {
        const weatherKeyManager = new WeatherApiKeyManager();

        Variable.derive(
            [bind(weatherKeyManager.weatherApiKey), bind(this._intervalFrequency), bind(this._location)],
            (weatherKey, weatherInterval, loc) => {
                if (!weatherKey) {
                    return this._weatherData.set(DEFAULT_WEATHER);
                }

                this._initializeWeatherPolling(weatherInterval, loc, weatherKey);
            },
        )();
    }

    /**
     * Sets up weather data tracking to update derived values
     */
    private _initializeWeatherTracker(): void {
        Variable.derive([bind(this._weatherData), bind(this._unitType)], () => {
            this._statusIcon.set(this._getWeatherStatusIcon());
            this._temperature.set(this._getTemperature());
            this._rainChance.set(this._getRainChance());
            this._windCondition.set(this._getWindConditions());
            this._statusIcon.set(this._getWeatherStatusIcon());
            this._gaugeIcon.set(this._getGaugeIcon());
        });
    }

    /**
     * Sets up a weather update interval function.
     *
     * @param weatherInterval - The interval in milliseconds at which to fetch weather updates
     * @param loc - The location for which to fetch weather data
     * @param weatherKey - The API key for accessing the weather service
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

        this._interval = interval(weatherInterval, async () => {
            this._fetchWeatherData(provider, loc, weatherKey);
        });
    }

    /**
     * Fetches weather data from the specified provider
     *
     * @param provider - The weather provider to use
     * @param loc - The location to fetch weather for
     * @param weatherKey - The API key for authentication
     */
    private async _fetchWeatherData(
        provider: WeatherProvider,
        loc: string,
        weatherKey: string,
    ): Promise<void> {
        const formattedLocation = loc.replaceAll(' ', '%20');
        const url =
            provider.formatUrl?.(formattedLocation, weatherKey) ||
            `${provider.baseUrl}?location=${formattedLocation}&key=${weatherKey}`;

        try {
            const WEATHER_FETCH_TIMEOUT_MS = 10000;
            const response = await httpClient.get(url, { timeout: WEATHER_FETCH_TIMEOUT_MS });

            if (response.data && provider.adapter) {
                const transformedData = provider.adapter.toStandardFormat(response.data);
                this._weatherData.set(transformedData);
            } else {
                this._weatherData.set(DEFAULT_WEATHER);
            }
        } catch (error) {
            console.error(`Failed to fetch weather from ${provider.name}: ${error}`);
            this._weatherData.set(DEFAULT_WEATHER);
        }
    }
}
