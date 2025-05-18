/**
 * Converts WeatherAPI.com response format to HyprPanel's generic weather format
 */

import type { Weather } from '../core.types';
import type { WeatherApiResponse } from './weather-api.types';

export class WeatherApiAdapter {
    /**
     * Transforms WeatherAPI.com's response structure to HyprPanel's unified weather format
     * 
     * @param data Raw response from WeatherAPI.com
     * @returns Normalized weather data
     */
    public static toGenericFormat(data: WeatherApiResponse): Weather {
        return {
            location: {
                name: data.location.name,
                region: data.location.region,
                country: data.location.country,
                coordinates: {
                    lat: data.location.lat,
                    lon: data.location.lon,
                },
                timezone: data.location.tz_id,
                localTimeEpoch: data.location.localtime_epoch,
            },
            current: {
                temperature: {
                    celsius: data.current.temp_c,
                    fahrenheit: data.current.temp_f,
                },
                condition: {
                    text: data.current.condition.text,
                    code: data.current.condition.code,
                    isDay: data.current.is_day === 1,
                },
                wind: {
                    speedKph: data.current.wind_kph,
                    speedMph: data.current.wind_mph,
                },
                humidity: data.current.humidity,
                feelsLike: {
                    celsius: data.current.feelslike_c,
                    fahrenheit: data.current.feelslike_f,
                },
            },
            forecast: data.forecast.forecastday.map(day => ({
                date: day.date,
                dateEpoch: day.date_epoch,
                tempMin: {
                    celsius: day.day.mintemp_c,
                    fahrenheit: day.day.mintemp_f,
                },
                tempMax: {
                    celsius: day.day.maxtemp_c,
                    fahrenheit: day.day.maxtemp_f,
                },
                condition: {
                    text: day.day.condition.text,
                    code: day.day.condition.code,
                    isDay: true,
                },
                chanceOfRain: day.day.daily_chance_of_rain,
                hourly: day.hour.map(hour => ({
                    time: hour.time_epoch,
                    temperature: {
                        celsius: hour.temp_c,
                        fahrenheit: hour.temp_f,
                    },
                    condition: {
                        text: hour.condition.text,
                        code: hour.condition.code,
                        isDay: hour.is_day === 1,
                    },
                    chanceOfRain: hour.chance_of_rain,
                })),
            })),
        };
    }
}