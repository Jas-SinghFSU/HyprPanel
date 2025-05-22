/**
 * Provider-agnostic weather type definitions
 * These types represent the core weather data used by HyprPanel
 */

import { WeatherApiAdapter } from './weatherApi/weather-api.adapter';

export interface Temperature {
    celsius: number;
    fahrenheit: number;
}

export interface Wind {
    speedKph: number;
    speedMph: number;
}

export interface Condition {
    text: string;
    code: number;
    isDay: boolean;
}

export interface CurrentWeather {
    temperature: Temperature;
    condition: Condition;
    wind: Wind;
    humidity?: number;
    feelsLike?: Temperature;
}

export interface HourlyForecast {
    time: number;
    temperature: Temperature;
    condition: Condition;
    chanceOfRain?: number;
}

export interface DailyForecast {
    date: string;
    dateEpoch: number;
    tempMin: Temperature;
    tempMax: Temperature;
    condition: Condition;
    chanceOfRain: number;
    hourly: HourlyForecast[];
}

export interface Location {
    name: string;
    region?: string;
    country?: string;
    coordinates: {
        lat: number;
        lon: number;
    };
    timezone?: string;
    localTimeEpoch: number;
}

export interface Weather {
    location: Location;
    current: CurrentWeather;
    forecast: DailyForecast[];
}

type Adapters = WeatherApiAdapter;

export interface WeatherProvider {
    name: string;
    baseUrl?: string;
    adapter?: Adapters;
    formatUrl?: (location: string, apiKey: string) => string;
}
