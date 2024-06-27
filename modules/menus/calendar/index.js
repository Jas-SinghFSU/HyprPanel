import PopupWindow from "../PopupWindow.js";
import icons from "../../icons/index.js";
import { keyRing } from "../../../../../Documents/Keys/keyList.js";

const time = Variable("", {
  poll: [1000, 'date "+%I:%M:%S"'],
});

const period = Variable("", {
  poll: [1000, 'date "+%p"'],
});
const defaultWeather = {
  current: {
    temp_f: 0,
    wind_mph: 0,
    condition: {
      text: "Clear",
    },
    forecast: {
      forecastday: [
        {
          day: {
            daily_chance_of_rain: 0,
          },
        },
      ],
    },
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

const TimeWidget = () => {
  return Widget.Box({
    class_name: "calendar-menu-item-container clock",
    hexpand: true,
    vpack: "center",
    hpack: "fill",
    child: Widget.Box({
      hexpand: true,
      vpack: "center",
      hpack: "center",
      class_name: "clock-content-items",
      children: [
        Widget.Box({
          hpack: "center",
          children: [
            Widget.Label({
              class_name: "clock-content-time",
              label: time.bind(),
            }),
          ],
        }),
        Widget.Box({
          hpack: "center",
          children: [
            Widget.Label({
              vpack: "end",
              class_name: "clock-content-period",
              label: period.bind(),
            }),
          ],
        }),
      ],
    }),
  });
};

const CalendarWidget = () => {
  return Widget.Box({
    class_name: "calendar-menu-item-container calendar",
    hpack: "fill",
    vpack: "fill",
    expand: true,
    child: Widget.Box({
      class_name: "calendar-container-box",
      child: Widget.Calendar({
        expand: true,
        hpack: "fill",
        vpack: "fill",
        class_name: "calendar-menu-widget",
        showDayNames: true,
        showDetails: false,
        showHeading: true,
      }),
    }),
  });
};

const WeatherWidget = () => {
  return Widget.Box({
    class_name: "calendar-menu-item-container weather",
    child: Widget.Box({
      class_name: "weather-container-box",
      setup: (self) => {
        Utils.interval(6000, () => {
          Utils.execAsync(
            `curl "https://api.weatherapi.com/v1/forecast.json?key=${keyRing.weatherapi}&q=93722&days=1&aqi=no&alerts=no"`,
          ).then((res) => {
            theWeather.value = JSON.parse(res);
          });
        });

        return (self.child = Widget.Box({
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
                        .toLowerCase()
                        .replaceAll(" ", "_")
                    ];
                  }),
                }),
              ],
            }),
            Widget.Box({
              hexpand: true,
              vpack: "center",
              hpack: "center",
              class_name: "calendar-menu-weather today temp container",
              vertical: true,
              children: [
                Widget.Box({
                  children: [
                    Widget.Label({
                      class_name: "calendar-menu-weather today temp label",
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
                        .as((v) => getIcon(Math.ceil(v.current.temp_f)).icon),
                    }),
                  ],
                }),
                Widget.Label({
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
              ],
            }),
            Widget.Box({
              class_name: "calendar-menu-weather today stats container",
              hpack: "end",
              vpack: "start",
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
        }));
      },
    }),
  });
};

export default () => {
  return PopupWindow({
    name: "calendarmenu",
    visible: false,
    transition: "crossfade",
    layout: "top-right",
    child: Widget.Box({
      class_name: "calendar-menu-content",
      css: "padding: 1px; margin: -1px;",
      vexpand: false,
      children: [
        Widget.Box({
          class_name: "calendar-content-container",
          vertical: true,
          children: [
            Widget.Box({
              class_name: "calendar-content-items",
              vertical: true,
              children: [TimeWidget(), CalendarWidget(), WeatherWidget()],
            }),
          ],
        }),
      ],
    }),
  });
};
