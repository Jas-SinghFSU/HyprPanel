export interface WeatherApiResponse {
    location: WeatherApiLocation;
    current: WeatherApiCurrent;
    forecast: WeatherApiForecast;
}

interface WeatherApiLocation {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
}

interface WeatherApiCurrent {
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: WeatherApiCondition;
    wind_mph: number;
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
}

interface WeatherApiCondition {
    text: string;
    icon: string;
    code: number;
}

interface WeatherApiForecast {
    forecastday: WeatherApiForecastDay[];
}

interface WeatherApiForecastDay {
    date: string;
    date_epoch: number;
    day: WeatherApiDay;
    hour: WeatherApiHour[];
}

interface WeatherApiDay {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    condition: WeatherApiCondition;
    daily_chance_of_rain: number;
}

interface WeatherApiHour {
    time_epoch: number;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: WeatherApiCondition;
    chance_of_rain?: number;
}
