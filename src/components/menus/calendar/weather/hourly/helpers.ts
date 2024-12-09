import { isValidWeatherIconTitle } from 'src/globals/weather';
import { Weather, WeatherIconTitle } from 'src/lib/types/weather';

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
