/**
 * Maps weather conditions to their corresponding icons
 */

import { WeatherCondition } from '../types';
import { WeatherIcon } from '../types/condition.types';

/**
 * Gets the appropriate weather icon for a condition
 * @param condition Weather condition
 * @param isDay Whether it's daytime (for conditions that have day/night variants)
 * @returns Weather icon
 */
export function getWeatherIcon(condition: WeatherCondition, isDay = true): WeatherIcon {
    if (condition.text === 'PARTLY_CLOUDY_NIGHT' && !isDay) {
        return WeatherIcon.PARTLY_CLOUDY_NIGHT;
    }

    return WeatherIcon[condition.text] ?? WeatherIcon.WARNING;
}
