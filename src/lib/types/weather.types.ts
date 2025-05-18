/**
 * Legacy weather types - maintained for backward compatibility
 * New code should use the modular types in weather/
 */

import { weatherIcons } from 'src/lib/icons/weather';

export { UnitType, Weather as GenericWeather } from './weather/core.types';

export { WeatherApiResponse as Weather } from './weather/providers/weather-api.types';

export type {
    WeatherApiLocation as Location,
    WeatherApiCurrent as Current,
    WeatherApiForecast as Forecast,
    WeatherApiForecastDay as Forecastday,
    WeatherApiDay as Day,
    WeatherApiCondition as Condition,
} from './weather/providers/weather-api.types';

export type WeatherIconTitle = keyof typeof weatherIcons;
export type WeatherIcon = (typeof weatherIcons)[WeatherIconTitle];
