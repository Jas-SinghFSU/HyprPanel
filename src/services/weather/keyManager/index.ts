import { GLib, Variable } from 'astal';
import options from 'src/configuration';

const { EXISTS, IS_REGULAR } = GLib.FileTest;

/**
 * Manages weather API key retrieval and validation
 * Supports loading keys from files or direct input
 */
export class WeatherApiKeyManager {
    public weatherApiKey: Variable<string> = Variable('');

    private readonly _apiKeyUserInput = options.menus.clock.weather.key;

    constructor() {
        this._mountWeatherKey(this._apiKeyUserInput.get());

        this._apiKeyUserInput.subscribe((key) => {
            this._mountWeatherKey(key);
        });
    }

    /**
     * Updates the weather API key variable with the processed key value
     *
     * @param key - The API key input which could be a direct key or file path
     */
    private _mountWeatherKey(key: string): void {
        const fetchedKey = this._getWeatherKey(key);

        this.weatherApiKey.set(fetchedKey);
    }

    /**
     * Retrieves the weather API key from a file if it exists and is valid.
     *
     * @param apiKey - The path to the file containing the weather API key.
     * @returns The weather API key if found, otherwise the original apiKey.
     */
    private _getWeatherKey(apiKey: string): string {
        const weatherKey = apiKey;

        const keyIsAFilePath = GLib.file_test(weatherKey, EXISTS) && GLib.file_test(weatherKey, IS_REGULAR);

        if (!keyIsAFilePath) {
            return apiKey;
        }

        try {
            const fileContentArray = GLib.file_get_contents(weatherKey)[1];
            const fileContent = new TextDecoder().decode(fileContentArray);

            if (!fileContent) {
                console.error('weather_api_key file is empty');
                return '';
            }

            const parsedContent = JSON.parse(fileContent);

            if (parsedContent.weather_api_key !== undefined) {
                return parsedContent.weather_api_key;
            }

            console.error('weather_api_key is missing in the JSON content');
            return '';
        } catch (error) {
            console.error(`Failed to read or parse weather key file: ${error}`);
            return '';
        }
    }
}
