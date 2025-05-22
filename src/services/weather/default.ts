import { Weather } from './providers/core.types';

export const DEFAULT_WEATHER: Weather = {
    location: {
        name: 'Tahiti',
        region: 'Somewhere',
        country: 'United States of America',
        coordinates: {
            lat: 0,
            lon: 0,
        },
        timezone: 'Tahiti',
        localTimeEpoch: 1721981457,
    },
    current: {
        temperature: {
            celsius: 0,
            fahrenheit: 0,
        },
        condition: {
            text: 'Clear',
            code: 1000,
            isDay: false,
        },
        wind: {
            speedKph: 0,
            speedMph: 0,
        },
        humidity: 0,
        feelsLike: {
            celsius: 0,
            fahrenheit: 0,
        },
    },
    forecast: [
        {
            date: '2024-07-26',
            dateEpoch: 1721952000,
            tempMin: {
                celsius: 0,
                fahrenheit: 0,
            },
            tempMax: {
                celsius: 0,
                fahrenheit: 0,
            },
            condition: {
                text: 'Sunny',
                code: 1000,
                isDay: true,
            },
            chanceOfRain: 0,
            hourly: [
                {
                    time: 1721977200,
                    temperature: {
                        celsius: 0,
                        fahrenheit: 0,
                    },
                    condition: {
                        text: 'Clear',
                        code: 1000,
                        isDay: false,
                    },
                    chanceOfRain: 0,
                },
                {
                    time: 1721980800,
                    temperature: {
                        celsius: 0,
                        fahrenheit: 0,
                    },
                    condition: {
                        text: 'Clear',
                        code: 1000,
                        isDay: false,
                    },
                    chanceOfRain: 0,
                },
            ],
        },
    ],
};
