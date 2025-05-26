import { WeatherProvider } from './types';
import { WeatherApiAdapter } from './weatherApi';

const weatherProviders: Record<string, WeatherProvider> = {
    weatherapi: {
        name: 'WeatherAPI.com',
        baseUrl: 'https://api.weatherapi.com/v1',
        adapter: new WeatherApiAdapter(),
        formatUrl: (location: string, apiKey: string) =>
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&aqi=no&alerts=no`,
    },
};

/**
 * Retrieves a weather provider configuration by its identifier
 *
 * @param providerId - Provider identifier (e.g., 'weatherapi', 'openweathermap')
 * @returns Provider configuration or undefined if not found
 */
export function getWeatherProvider(providerId: string): WeatherProvider | undefined {
    return weatherProviders[providerId];
}

/**
 * Lists all available weather provider identifiers
 *
 * @returns Array of provider IDs
 */
export function getAvailableProviders(): string[] {
    return Object.keys(weatherProviders);
}
