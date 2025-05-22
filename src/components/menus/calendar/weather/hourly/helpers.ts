import WeatherService from 'src/services/weather';
import { Weather } from 'src/services/weather/providers/core.types';
import { WeatherIconTitle } from 'src/services/weather/types';

const weatherService = WeatherService.get_default();

/**
 * Retrieves the next epoch time for weather data.
 *
 * This function calculates the next epoch time based on the current weather data and the specified number of hours from now.
 * It ensures that the prediction remains within the current day by rewinding the time if necessary.
 *
 * @param wthr The current weather data.
 * @param hoursFromNow The number of hours from now to calculate the next epoch time.
 *
 * @returns The next epoch time as a number.
 */
export const getNextEpoch = (wthr: Weather, hoursFromNow: number): number => {
    const currentEpoch = wthr.location.localTimeEpoch;
    const epochAtHourStart = currentEpoch - (currentEpoch % 3600);
    let nextEpoch = 3600 * hoursFromNow + epochAtHourStart;

    const curHour = new Date(currentEpoch * 1000).getHours();

    /*
     * NOTE: Since the API is only capable of showing the current day; if
     * the hours left in the day are less than 4 (aka spilling into the next day),
     * then rewind to contain the prediction within the current day.
     */
    if (curHour > 19) {
        const hoursToRewind = curHour - 19;
        nextEpoch = 3600 * hoursFromNow + epochAtHourStart - hoursToRewind * 3600;
    }
    return nextEpoch;
};

/**
 * Retrieves the weather icon query for a specific time in the future.
 *
 * This function calculates the next epoch time and retrieves the corresponding weather data.
 * It then generates a weather icon query based on the weather condition and time of day.
 *
 * @param weather The current weather data.
 * @param hoursFromNow The number of hours from now to calculate the weather icon query.
 *
 * @returns The weather icon query as a string.
 */
export const getIconQuery = (weather: Weather, hoursFromNow: number): WeatherIconTitle => {
    if (!weather?.forecast?.[0]?.hourly) {
        return 'warning';
    }
    
    const nextEpoch = getNextEpoch(weather, hoursFromNow);
    const weatherAtEpoch = weather.forecast[0].hourly.find((h) => h.time === nextEpoch);

    if (weatherAtEpoch === undefined) {
        return 'warning';
    }

    let iconQuery = weatherAtEpoch.condition.text.trim().toLowerCase().replaceAll(' ', '_');

    if (!weatherAtEpoch?.condition.isDay && iconQuery === 'partly_cloudy') {
        iconQuery = 'partly_cloudy_night';
    }

    if (weatherService.isValidWeatherIconTitle(iconQuery)) {
        return iconQuery;
    } else {
        return 'warning';
    }
};
