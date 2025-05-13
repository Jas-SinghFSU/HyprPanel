import { GLib, Variable } from 'astal';
const { EXISTS, IS_REGULAR } = GLib.FileTest;
import options from 'src/options';

export class WeatherApiKeyManager {
    public weatherApiKey: Variable<string> = Variable('');

    private readonly _apiKeyUserInput = options.menus.clock.weather.key;

    constructor() {
        this._apiKeyUserInput.subscribe((key) => {
            const fetchedKey = this._getWeatherKey(key);

            this.weatherApiKey.set(fetchedKey);
        });
    }

    /**
     * Retrieves the weather API key from a file if it exists and is valid.
     *
     * @param apiKey - The path to the file containing the weather API key.
     * @returns - The weather API key if found, otherwise the original apiKey.
     */
    private _getWeatherKey(apiKey: string): string {
        const weatherKey = apiKey;

        if (GLib.file_test(weatherKey, EXISTS) && GLib.file_test(weatherKey, IS_REGULAR)) {
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
                } else {
                    console.error('weather_api_key is missing in the JSON content');
                    return '';
                }
            } catch (error) {
                console.error(`Failed to read or parse weather key file: ${error}`);
                return '';
            }
        }

        return apiKey;
    }
}
