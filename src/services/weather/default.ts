import { Weather } from './types';

export const DEFAULT_WEATHER: Weather = {
    location: {
        name: 'Unknown',
        region: '',
        country: '',
    },
    current: {
        temperature: 0,
        feelsLike: 0,
        condition: {
            text: 'WARNING',
            isDay: true,
        },
        wind: {
            speed: 0,
            direction: 'N',
            degree: 0,
        },
        humidity: 0,
    },
    forecast: [
        {
            date: new Date(),
            tempMin: 0,
            tempMax: 0,
            condition: {
                text: 'WARNING',
                isDay: true,
            },
            chanceOfRain: 0,
            hourly: [],
        },
    ],
    lastUpdated: new Date(),
    provider: 'none',
};
