export type WindDirection =
    | 'N'
    | 'NNE'
    | 'NE'
    | 'ENE'
    | 'E'
    | 'ESE'
    | 'SE'
    | 'SSE'
    | 'S'
    | 'SSW'
    | 'SW'
    | 'WSW'
    | 'W'
    | 'WNW'
    | 'NW'
    | 'NNW';

export type Percentage = number;
export type WeatherStatus = keyof typeof WeatherIcon;

export interface Wind {
    /** Wind speed in kilometers per hour */
    speed: number;
    /** Compass direction (16-point) */
    direction?: WindDirection;
    /** Wind direction in degrees (0-360) */
    degree?: number;
}

export interface WeatherCondition {
    /** Human-readable weather description */
    text: WeatherStatus;
    /** Whether it's daytime (for icon selection) */
    isDay?: boolean;
}

export interface CurrentWeather {
    /** Temperature value in Celsius */
    temperature: number;
    /** Feels like temperature in Celsius */
    feelsLike?: number;
    /** Weather condition */
    condition: WeatherCondition;
    /** Wind information */
    wind?: Wind;
    /** Chance of rain */
    chanceOfRain?: Percentage;
    /** Relative humidity (0-100) */
    humidity?: Percentage;
}

export interface HourlyForecast {
    /** Forecast time as Date */
    time: Date;
    /** Forecasted temperature in Celsius */
    temperature: number;
    /** Weather condition */
    condition?: WeatherCondition;
    /** Probability of rain (0-100) */
    chanceOfRain?: Percentage;
}

export interface DailyForecast {
    /** Forecast date as Date */
    date: Date;
    /** Minimum temperature for the day in Celsius */
    tempMin: number;
    /** Maximum temperature for the day in Celsius */
    tempMax: number;
    /** Predominant weather condition */
    condition: WeatherCondition;
    /** Daily rain probability (0-100) */
    chanceOfRain?: Percentage;
    /** Hourly breakdown (if available) */
    hourly?: HourlyForecast[];
}

export interface WeatherLocation {
    /** City/location name */
    name: string;
    /** State/province/region */
    region?: string;
    /** Country name */
    country?: string;
}

export interface Weather {
    /** Location information */
    location: WeatherLocation;
    /** Current weather conditions */
    current: CurrentWeather;
    /** Weather forecast (if available) */
    forecast?: DailyForecast[];
    /** Last update time as Date */
    lastUpdated: Date;
    /** Provider name for debugging */
    provider?: string;
}

export enum WeatherIcon {
    WARNING = '󰼯',
    SUNNY = '󰖙',
    CLEAR = '󰖔',
    'PARTLY CLOUDY' = '󰖕',
    'PARTLY CLOUDY NIGHT' = '󰼱',
    CLOUDY = '󰖐',
    FOG = '󰖑',
    'LIGHT RAIN' = '󰼳',
    RAIN = '󰖗',
    'HEAVY RAIN' = '󰖖',
    SNOW = '󰼴',
    'HEAVY SNOW' = '󰼶',
    SLEET = '󰙿',
    HAIL = '󰖒',
    THUNDERSTORM = '󰙾',
}

export interface GaugeIcon {
    icon: '' | '' | '' | '' | '';
    color:
        | 'weather-color red'
        | 'weather-color orange'
        | 'weather-color lavender'
        | 'weather-color blue'
        | 'weather-color sky';
}
