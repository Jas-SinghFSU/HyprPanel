import type {
    CurrentWeather,
    DailyForecast,
    HourlyForecast,
    Weather,
    WeatherLocation,
    Wind,
} from '../../types';
import { WeatherAdapter } from '../types';
import { WeatherApiStatusMapper } from './mapper';
import type { WeatherApiForecastDay, WeatherApiHour, WeatherApiResponse } from './types';

export class WeatherApiAdapter implements WeatherAdapter<WeatherApiResponse> {
    private readonly _statusMapper: WeatherApiStatusMapper;

    constructor() {
        this._statusMapper = new WeatherApiStatusMapper();
    }

    /**
     * Transforms WeatherAPI.com's response structure to the standard format
     *
     * @param data - Raw response from WeatherAPI.com
     * @returns Normalized weather data
     */
    public toStandardFormat(data: WeatherApiResponse): Weather {
        return {
            location: this._mapLocation(data),
            current: this._mapCurrentWeather(data),
            forecast: data.forecast.forecastday.map(this._mapDailyForecast.bind(this)),
            lastUpdated: new Date(),
        };
    }

    /**
     * Maps WeatherAPI location data to standard format
     *
     * @param data - WeatherAPI response data
     * @returns Standardized location information
     */
    private _mapLocation(data: WeatherApiResponse): WeatherLocation {
        const location = data.location;
        return {
            name: location.name,
            region: location.region,
        };
    }

    /**
     * Maps current weather conditions to standard format
     *
     * @param data - WeatherAPI response data
     * @returns Standardized current weather data
     */
    private _mapCurrentWeather(data: WeatherApiResponse): CurrentWeather {
        const currentWeather = data.current;
        const currentRainChance = data.forecast.forecastday[0].hour[0].chance_of_rain;

        return {
            temperature: currentWeather.temp_c,
            condition: {
                text: this._statusMapper.toStatus(currentWeather.condition.text),
                isDay: currentWeather.is_day === 1,
            },
            wind: {
                speed: currentWeather.wind_kph,
                direction: currentWeather.wind_dir as Wind['direction'],
            },
            chanceOfRain: currentRainChance,
            humidity: currentWeather.humidity,
            feelsLike: currentWeather.feelslike_c,
        };
    }

    /**
     * Maps daily forecast data to standard format
     *
     * @param forecastDay - WeatherAPI forecast day data
     * @returns Standardized daily forecast
     */
    private _mapDailyForecast(forecastDay: WeatherApiForecastDay): DailyForecast {
        return {
            date: new Date(forecastDay.date),
            tempMin: forecastDay.day.mintemp_c,
            tempMax: forecastDay.day.maxtemp_c,
            condition: {
                text: this._statusMapper.toStatus(forecastDay.day.condition.text),
            },
            chanceOfRain: forecastDay.day.daily_chance_of_rain,
            hourly: forecastDay.hour.map(this._mapHourlyForecast.bind(this)),
        };
    }

    /**
     * Maps hourly forecast data to standard format
     *
     * @param hourlyForecast - WeatherAPI hourly forecast data
     * @returns Standardized hourly forecast
     */
    private _mapHourlyForecast(hourlyForecast: WeatherApiHour): HourlyForecast {
        return {
            time: new Date(hourlyForecast.time),
            temperature: hourlyForecast.temp_c,
            condition: {
                text: this._statusMapper.toStatus(hourlyForecast.condition.text.trim()),
                isDay: hourlyForecast.is_day === 1,
            },
            chanceOfRain: hourlyForecast.chance_of_rain,
        };
    }
}
