import { Weather } from '../types';

export interface WeatherProvider {
    /** Provider display name */
    name: string;
    /** Base API URL */
    baseUrl?: string;
    /** Adapter instance for data transformation */
    adapter?: WeatherAdapter;
    /** Function to construct API URL with parameters */
    formatUrl?: (location: string, apiKey: string) => string;
}

export interface WeatherAdapter<T = unknown> {
    /**
     * Converts provider-specific response to standard Weather format
     * @param data Raw data from weather provider
     * @returns Standardized weather data
     */
    toStandardFormat(data: T): Weather;

    /**
     * Validates that required data is present in provider response
     * @param data Raw data from weather provider
     * @returns True if data contains all required fields
     */
    validate?(data: T): boolean;
}
