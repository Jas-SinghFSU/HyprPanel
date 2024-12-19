import { isValidWeatherIconTitle } from 'src/globals/weather';
import { Weather, WeatherIconTitle } from 'src/lib/types/weather';

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
    const currentEpoch = wthr.location.localtime_epoch;
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
    const nextEpoch = getNextEpoch(weather, hoursFromNow);
    const weatherAtEpoch = weather.forecast.forecastday[0].hour.find((h) => h.time_epoch === nextEpoch);

    if (weatherAtEpoch === undefined) {
        return 'warning';
    }

    let iconQuery = weatherAtEpoch.condition.text.trim().toLowerCase().replaceAll(' ', '_');

    if (!weatherAtEpoch?.is_day && iconQuery === 'partly_cloudy') {
        iconQuery = 'partly_cloudy_night';
    }

    if (isValidWeatherIconTitle(iconQuery)) {
        return iconQuery;
    } else {
        return 'warning';
    }
};
