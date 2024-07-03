import icons from "../../../icons/index.js";
import { keyRing } from "../../../../../../Documents/Keys/keyList.js";

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

const getIcon = (fahren) => {
  const icons = {
    100: "",
    75: "",
    50: "",
    25: "",
    0: "",
  };
  const colors = {
    100: "weather-color red",
    75: "weather-color orange",
    50: "weather-color lavender",
    25: "weather-color blue",
    0: "weather-color sky",
  };

  const threshold =
    fahren < 0
      ? 0
      : [100, 75, 50, 25, 0].find((threshold) => threshold <= fahren);

  return {
    icon: icons[threshold],
    color: colors[threshold],
  };
};

const WeatherWidget = () => {
  return Widget.Box({
    class_name: "calendar-menu-item-container weather",
    child: Widget.Box({
      class_name: "weather-container-box",
      setup: (self) => {
        Utils.interval(60 * 1000, () => {
          Utils.execAsync(
            `curl "https://api.weatherapi.com/v1/forecast.json?key=${keyRing.weatherapi}&q=93722&days=1&aqi=no&alerts=no"`,
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

        return (self.child = Widget.Box({
          vertical: true,
          hexpand: true,
          children: [
            Widget.Box({
              class_name: "calendar-menu-weather today",
              hexpand: true,
              children: [
                Widget.Box({
                  vpack: "center",
                  hpack: "start",
                  class_name: "calendar-menu-weather today icon container",
                  children: [
                    Widget.Icon({
                      class_name: "calendar-menu-weather today icon",
                      icon: theWeather.bind("value").as((v) => {
                        return icons.weather[
                          v.current.condition.text
                            .trim()
                            .toLowerCase()
                            .replaceAll(" ", "_")
                        ];
                      }),
                    }),
                  ],
                }),
                Widget.Box({
                  hpack: "center",
                  vpack: "center",
                  vertical: true,
                  children: [
                    Widget.Box({
                      hexpand: true,
                      vpack: "center",
                      class_name: "calendar-menu-weather today temp container",
                      vertical: false,
                      children: [
                        Widget.Box({
                          hexpand: true,
                          hpack: "center",
                          children: [
                            Widget.Label({
                              class_name:
                                "calendar-menu-weather today temp label",
                              label: theWeather
                                .bind("value")
                                .as((v) => `${Math.ceil(v.current.temp_f)}° F`),
                            }),
                            Widget.Label({
                              class_name: theWeather
                                .bind("value")
                                .as(
                                  (v) =>
                                    `calendar-menu-weather today temp label icon ${getIcon(Math.ceil(v.current.temp_f)).color}`,
                                ),
                              label: theWeather
                                .bind("value")
                                .as(
                                  (v) =>
                                    getIcon(Math.ceil(v.current.temp_f)).icon,
                                ),
                            }),
                          ],
                        }),
                      ],
                    }),
                    Widget.Box({
                      hpack: "center",
                      child: Widget.Label({
                        max_width_chars: 17,
                        truncate: "end",
                        lines: 2,
                        class_name: theWeather
                          .bind("value")
                          .as(
                            (v) =>
                              `calendar-menu-weather today condition label ${getIcon(Math.ceil(v.current.temp_f)).color}`,
                          ),
                        label: theWeather
                          .bind("value")
                          .as((v) => v.current.condition.text),
                      }),
                    }),
                  ],
                }),
                Widget.Box({
                  class_name: "calendar-menu-weather today stats container",
                  hpack: "end",
                  vpack: "center",
                  vertical: true,
                  children: [
                    Widget.Box({
                      class_name: "weather wind",
                      children: [
                        Widget.Label({
                          class_name: "weather wind icon",
                          label: "",
                        }),
                        Widget.Label({
                          class_name: "weather wind label",
                          label: theWeather
                            .bind("value")
                            .as((v) => `${Math.floor(v.current.wind_mph)} mph`),
                        }),
                      ],
                    }),
                    Widget.Box({
                      class_name: "weather precip",
                      children: [
                        Widget.Label({
                          class_name: "weather precip icon",
                          label: "",
                        }),
                        Widget.Label({
                          class_name: "weather precip label",
                          label: theWeather
                            .bind("value")
                            .as(
                              (v) =>
                                `${v.forecast.forecastday[0].day.daily_chance_of_rain}%`,
                            ),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            Widget.Separator({
              class_name: "menu-separator weather",
            }),
            Widget.Box({
              vertical: false,
              hexpand: true,
              hpack: "fill",
              class_name: "hourly-weather-container",
              children: [1, 2, 3, 4].map((hoursFromNow) => {
                const getNextEpoch = (wthr) => {
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
                    nextEpoch =
                      3600 * hoursFromNow +
                      epochAtHourStart -
                      hoursToRewind * 3600;
                  }
                  return nextEpoch;
                };

                return Widget.Box({
                  class_name: "hourly-weather-item",
                  hexpand: true,
                  vertical: true,
                  children: [
                    Widget.Label({
                      class_name: "hourly-weather-time",
                      label: theWeather.bind("value").as((w) => {
                        if (!Object.keys(w).length) {
                          return "-";
                        }

                        const nextEpoch = getNextEpoch(w);
                        const dateAtEpoch = new Date(nextEpoch * 1000);
                        let hours = dateAtEpoch.getHours();
                        const ampm = hours >= 12 ? "PM" : "AM";
                        hours = hours % 12 || 12;

                        return `${hours}${ampm}`;
                      }),
                    }),
                    Widget.Icon({
                      class_name: "hourly-weather-icon",
                      icon: theWeather.bind("value").as((w) => {
                        if (!Object.keys(w).length) {
                          return "-";
                        }

                        const nextEpoch = getNextEpoch(w);
                        const weatherAtEpoch =
                          w.forecast.forecastday[0].hour.find(
                            (h) => h.time_epoch === nextEpoch,
                          );

                        return icons.weather[
                          weatherAtEpoch?.condition.text
                            .trim()
                            .toLowerCase()
                            .replaceAll(" ", "_")
                        ];
                      }),
                    }),
                    Widget.Label({
                      class_name: "hourly-weather-temp",
                      label: theWeather.bind("value").as((w) => {
                        if (!Object.keys(w).length) {
                          return "-";
                        }

                        const nextEpoch = getNextEpoch(w);
                        const weatherAtEpoch =
                          w.forecast.forecastday[0].hour.find(
                            (h) => h.time_epoch === nextEpoch,
                          );

                        return `${weatherAtEpoch ? Math.ceil(weatherAtEpoch.temp_f) : "-"}° F`;
                      }),
                    }),
                  ],
                });
              }),
            }),
          ],
        }));
      },
    }),
  });
};

export { WeatherWidget };
