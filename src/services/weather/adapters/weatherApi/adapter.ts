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
import type {
    WeatherApiCurrent,
    WeatherApiForecastDay,
    WeatherApiHour,
    WeatherApiLocation,
    WeatherApiResponse,
} from './types';

export class WeatherApiAdapter implements WeatherAdapter<WeatherApiResponse> {
    private readonly _statusMapper: WeatherApiStatusMapper;

    constructor() {
        this._statusMapper = new WeatherApiStatusMapper();
    }

    /**
     * Transforms WeatherAPI.com's response structure to the standard format
     *
     * @param data Raw response from WeatherAPI.com
     * @returns Normalized weather data
     */
    public toStandardFormat(data: WeatherApiResponse): Weather {
        return {
            location: this._mapLocation(data.location),
            current: this._mapCurrentWeather(data.current),
            forecast: data.forecast.forecastday.map(this._mapDailyForecast.bind(this)),
            lastUpdated: new Date(),
        };
    }

    private _mapLocation(location: WeatherApiLocation): WeatherLocation {
        return {
            name: location.name,
            region: location.region,
        };
    }

    private _mapCurrentWeather(currentWeather: WeatherApiCurrent): CurrentWeather {
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
            humidity: currentWeather.humidity,
            feelsLike: currentWeather.feelslike_c,
        };
    }

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

    private _mapHourlyForecast(hourlyForecast: WeatherApiHour): HourlyForecast {
        return {
            time: new Date(hourlyForecast.time_epoch),
            temperature: hourlyForecast.temp_c,
            chanceOfRain: hourlyForecast.chance_of_rain,
        };
    }
}
