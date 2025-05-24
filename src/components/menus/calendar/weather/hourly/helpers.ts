import { toEpochTime } from 'src/lib/formatters/time';
import { Weather, WeatherStatus } from 'src/services/weather/types';
import { WeatherIcon } from 'src/services/weather/types/condition.types';

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
    const currentEpochTime = toEpochTime(wthr.lastUpdated);
    const epochAtHourStart = currentEpochTime - (currentEpochTime % 3600);
    const curHour = new Date(currentEpochTime * 1000).getHours();

    let nextEpoch = 3600 * hoursFromNow + epochAtHourStart;

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
export const getHourlyWeatherIcon = (weather: Weather, hoursFromNow: number): WeatherIcon => {
    if (!weather?.forecast?.[0]?.hourly) {
        return WeatherIcon.WARNING;
    }

    const nextEpoch = getNextEpoch(weather, hoursFromNow);
    const weatherAtEpoch = weather.forecast[0].hourly.find((hour) => toEpochTime(hour.time) === nextEpoch);

    if (weatherAtEpoch === undefined) {
        return WeatherIcon.WARNING;
    }

    let iconQuery: WeatherStatus = weatherAtEpoch.condition?.text ?? 'WARNING';

    if (!weatherAtEpoch?.condition?.isDay && iconQuery === 'PARTLY_CLOUDY') {
        iconQuery = 'PARTLY_CLOUDY';
    }
    return WeatherIcon[iconQuery];
};
