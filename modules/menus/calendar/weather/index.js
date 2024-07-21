import options from "options";
import { TodayIcon } from "./icon/index.js";
import { TodayStats } from "./stats/index.js";
import { TodayTemperature } from "./temperature/index.js";
import { Hourly } from "./hourly/index.js";

const { key, interval } = options.menus.clock.weather;

const defaultWeather = {
  location: {
    localtime_epoch: 1719471600,
  },
  current: {
    temp_f: 0,
    wind_mph: 0,
    condition: {
      text: "Clear",
    },
  },
  forecast: {
    forecastday: [
      {
        day: {
          daily_chance_of_rain: 0,
        },
        hour: [
          {
            time_epoch: 1719471600,
            temp_f: 0,
            condition: {
              text: "Clear",
            },
          },
        ],
      },
    ],
  },
};

const theWeather = Variable(defaultWeather);

const WeatherWidget = () => {
  return Widget.Box({
    class_name: "calendar-menu-item-container weather",
    child: Widget.Box({
      class_name: "weather-container-box",
      setup: (self) => {
        Utils.merge(
          [key.bind("value"), interval.bind("value")],
          (weatherKey, weatherInterval) => {
            Utils.interval(weatherInterval, () => {
              Utils.execAsync(
                `curl "https://api.weatherapi.com/v1/forecast.json?key=${weatherKey}&q=93722&days=1&aqi=no&alerts=no"`,
              )
                .then((res) => {
                  if (typeof res === "string") {
                    theWeather.value = JSON.parse(res);
                  }
                })
                .catch((err) => {
                  console.error(`Failed to fetch weather: ${err}`);
                  theWeather.value = defaultWeather;
                });
            });
          },
        );

        return (self.child = Widget.Box({
          vertical: true,
          hexpand: true,
          children: [
            Widget.Box({
              class_name: "calendar-menu-weather today",
              hexpand: true,
              children: [
                TodayIcon(theWeather),
                TodayTemperature(theWeather),
                TodayStats(theWeather),
              ],
            }),
            Widget.Separator({
              class_name: "menu-separator weather",
            }),
            Hourly(theWeather),
          ],
        }));
      },
    }),
  });
};

export { WeatherWidget };
