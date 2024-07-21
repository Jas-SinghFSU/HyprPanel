import options from "options";

const { unit } = options.menus.clock.weather;

export const TodayStats = (theWeather) => {
  return Widget.Box({
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
            label: Utils.merge(
              [theWeather.bind("value"), unit.bind("value")],
              (wthr, unt) => {
                if (unt === "imperial") {
                  return `${Math.floor(wthr.current.wind_mph)} mph`;
                }
                return `${Math.floor(wthr.current.wind_kph)} kph`;
              },
            ),
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
                (v) => `${v.forecast.forecastday[0].day.daily_chance_of_rain}%`,
              ),
          }),
        ],
      }),
    ],
  });
};
