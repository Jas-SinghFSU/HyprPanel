import { weatherIcons } from './icons';

export type WeatherIconTitle = keyof typeof weatherIcons;
export type WeatherIcon = (typeof weatherIcons)[WeatherIconTitle];
