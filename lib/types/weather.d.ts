import { weatherIcons } from 'modules/icons/weather';

export type UnitType = 'imperial' | 'metric';

export type Weather = {
    location: Location;
    current: Current;
    forecast: Forecast;
};

export type Current = {
    last_updated_epoch?: number;
    last_updated?: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: Condition;
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
    time_epoch?: number;
    time?: string;
    snow_cm?: number;
    will_it_rain?: number;
    chance_of_rain?: number;
    will_it_snow?: number;
    chance_of_snow?: number;
};

export type Condition = {
    text: string;
    icon: string;
    code: number;
};

export type Forecast = {
    forecastday: Forecastday[];
};

export type Forecastday = {
    date: string;
    date_epoch: number;
    day: Day;
    astro: Astro;
    hour: Current[];
};

export type Astro = {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
    is_moon_up: number;
    is_sun_up: number;
};

export type Day = {
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
    condition: Condition;
    uv: number;
};

export type Location = {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
};

export type TemperatureIconColorMap = {
    [key: number]: string;
};

export type WeatherIconTitle = keyof typeof weatherIcons;
export type WeatherIcon = (typeof weatherIcons)[WeatherIconTitle];
