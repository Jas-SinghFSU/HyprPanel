import { Weather, WeatherIcon, WeatherStatus } from 'src/services/weather/types';

/**
 * Calculates the target hour for weather data lookup
 *
 * @param baseTime - The base time to calculate from
 * @param hoursFromNow - Number of hours to add
 * @returns A Date object set to the start of the target hour
 */
export const getTargetHour = (baseTime: Date, hoursFromNow: number): Date => {
    const targetTime = new Date(baseTime);
    const newHour = targetTime.getHours() + hoursFromNow;
    targetTime.setHours(newHour);
    targetTime.setMinutes(0, 0, 0);

    const currentHour = baseTime.getHours();
    if (currentHour > 19) {
        const hoursToRewind = currentHour - 19;
        targetTime.setHours(targetTime.getHours() - hoursToRewind);
    }

    return targetTime;
};

/**
 * Retrieves the weather icon for a specific hour in the future
 *
 * @param weather - The current weather data
 * @param hoursFromNow - Number of hours from now to get the icon for
 * @returns The appropriate weather icon
 */
export const getHourlyWeatherIcon = (weather: Weather, hoursFromNow: number): WeatherIcon => {
    if (!weather?.forecast?.[0]?.hourly) {
        return WeatherIcon.WARNING;
    }

    const targetHour = getTargetHour(weather.lastUpdated, hoursFromNow);
    const targetTime = targetHour.getTime();

    const weatherAtHour = weather.forecast[0].hourly.find((hour) => {
        const hourTime = hour.time.getTime();
        return hourTime === targetTime;
    });

    if (!weatherAtHour) {
        return WeatherIcon.WARNING;
    }

    const iconQuery: WeatherStatus = weatherAtHour.condition?.text ?? 'WARNING';
    return WeatherIcon[iconQuery];
};
