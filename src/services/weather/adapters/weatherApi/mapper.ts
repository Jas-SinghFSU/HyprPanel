import { WeatherStatus } from '../../types';
import { WeatherApiIcon } from './types';

export class WeatherApiStatusMapper {
    private readonly _WEATHER_API_STATUS_MAP: Record<WeatherApiIcon, WeatherStatus> = {
        warning: 'WARNING',
        sunny: 'SUNNY',
        clear: 'CLEAR',
        partly_cloudy: 'PARTLY CLOUDY',
        partly_cloudy_night: 'PARTLY CLOUDY NIGHT',
        cloudy: 'CLOUDY',
        overcast: 'PARTLY CLOUDY',
        mist: 'FOG',
        patchy_rain_nearby: 'LIGHT RAIN',
        patchy_rain_possible: 'LIGHT RAIN',
        patchy_snow_possible: 'SNOW',
        patchy_sleet_possible: 'SLEET',
        patchy_freezing_drizzle_possible: 'SLEET',
        thundery_outbreaks_possible: 'THUNDERSTORM',
        blowing_snow: 'HEAVY SNOW',
        blizzard: 'HEAVY SNOW',
        fog: 'FOG',
        freezing_fog: 'FOG',
        patchy_light_drizzle: 'LIGHT RAIN',
        light_drizzle: 'LIGHT RAIN',
        freezing_drizzle: 'SLEET',
        heavy_freezing_drizzle: 'SLEET',
        patchy_light_rain: 'LIGHT RAIN',
        light_rain: 'LIGHT RAIN',
        moderate_rain_at_times: 'RAIN',
        moderate_rain: 'LIGHT RAIN',
        heavy_rain_at_times: 'HEAVY RAIN',
        heavy_rain: 'HEAVY RAIN',
        light_freezing_rain: 'SLEET',
        moderate_or_heavy_freezing_rain: 'SLEET',
        light_sleet: 'SLEET',
        moderate_or_heavy_sleet: 'SLEET',
        patchy_light_snow: 'SNOW',
        light_snow: 'SNOW',
        patchy_moderate_snow: 'SNOW',
        moderate_snow: 'HEAVY SNOW',
        patchy_heavy_snow: 'HEAVY SNOW',
        heavy_snow: 'HEAVY SNOW',
        ice_pellets: 'HAIL',
        light_rain_shower: 'HEAVY RAIN',
        moderate_or_heavy_rain_shower: 'HEAVY RAIN',
        torrential_rain_shower: 'HEAVY RAIN',
        light_sleet_showers: 'SLEET',
        moderate_or_heavy_sleet_showers: 'SLEET',
        light_snow_showers: 'SNOW',
        moderate_or_heavy_snow_showers: 'SNOW',
        light_showers_of_ice_pellets: 'HAIL',
        moderate_or_heavy_showers_of_ice_pellets: 'HAIL',
        patchy_light_rain_with_thunder: 'THUNDERSTORM',
        moderate_or_heavy_rain_with_thunder: 'THUNDERSTORM',
        moderate_or_heavy_rain_in_area_with_thunder: 'THUNDERSTORM',
        patchy_light_snow_with_thunder: 'HEAVY SNOW',
        moderate_or_heavy_snow_with_thunder: 'HEAVY SNOW',
    };

    /**
     * Maps weather API status strings to standardized WeatherStatus
     *
     * @param status - The weather status string from the API
     * @returns The mapped WeatherStatus
     */
    public toStatus(status: string): WeatherStatus {
        const snakeCasedStatus = status.toLowerCase().replace(' ', '_');
        return this._WEATHER_API_STATUS_MAP[snakeCasedStatus as WeatherApiIcon] ?? 'WARNING';
    }
}
