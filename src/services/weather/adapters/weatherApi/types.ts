export interface WeatherApiResponse {
    location: WeatherApiLocation;
    current: WeatherApiCurrent;
    forecast: WeatherApiForecast;
}

export interface WeatherApiLocation {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
}

export interface WeatherApiCurrent {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: WeatherApiCondition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
}

export interface WeatherApiCondition {
    text: string;
    icon: string;
    code: number;
}

export interface WeatherApiForecast {
    forecastday: WeatherApiForecastDay[];
}

export interface WeatherApiForecastDay {
    date: string;
    date_epoch: number;
    day: WeatherApiDay;
    astro: WeatherApiAstro;
    hour: WeatherApiHour[];
}

export interface WeatherApiDay {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: WeatherApiCondition;
    uv: number;
}

export interface WeatherApiAstro {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
    is_moon_up: number;
    is_sun_up: number;
}

export interface WeatherApiHour {
    time_epoch: number;
    time: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: WeatherApiCondition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    snow_cm: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
}

export type WeatherApiIcon =
    | 'warning'
    | 'sunny'
    | 'clear'
    | 'partly_cloudy'
    | 'partly_cloudy_night'
    | 'cloudy'
    | 'overcast'
    | 'mist'
    | 'patchy_rain_nearby'
    | 'patchy_rain_possible'
    | 'patchy_snow_possible'
    | 'patchy_sleet_possible'
    | 'patchy_freezing_drizzle_possible'
    | 'thundery_outbreaks_possible'
    | 'blowing_snow'
    | 'blizzard'
    | 'fog'
    | 'freezing_fog'
    | 'patchy_light_drizzle'
    | 'light_drizzle'
    | 'freezing_drizzle'
    | 'heavy_freezing_drizzle'
    | 'patchy_light_rain'
    | 'light_rain'
    | 'moderate_rain_at_times'
    | 'moderate_rain'
    | 'heavy_rain_at_times'
    | 'heavy_rain'
    | 'light_freezing_rain'
    | 'moderate_or_heavy_freezing_rain'
    | 'light_sleet'
    | 'moderate_or_heavy_sleet'
    | 'patchy_light_snow'
    | 'light_snow'
    | 'patchy_moderate_snow'
    | 'moderate_snow'
    | 'patchy_heavy_snow'
    | 'heavy_snow'
    | 'ice_pellets'
    | 'light_rain_shower'
    | 'moderate_or_heavy_rain_shower'
    | 'torrential_rain_shower'
    | 'light_sleet_showers'
    | 'moderate_or_heavy_sleet_showers'
    | 'light_snow_showers'
    | 'moderate_or_heavy_snow_showers'
    | 'light_showers_of_ice_pellets'
    | 'moderate_or_heavy_showers_of_ice_pellets'
    | 'patchy_light_rain_with_thunder'
    | 'moderate_or_heavy_rain_with_thunder'
    | 'moderate_or_heavy_rain_in_area_with_thunder'
    | 'patchy_light_snow_with_thunder'
    | 'moderate_or_heavy_snow_with_thunder';
