import options from "options";
const { unit } = options.menus.clock.weather;

export const TodayTemperature = (theWeather) => {
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

  return Widget.Box({
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
                class_name: "calendar-menu-weather today temp label",
                label: Utils.merge(
                  [theWeather.bind("value"), unit.bind("value")],
                  (wthr, unt) => {
                    if (unt === "imperial") {
                      return `${Math.ceil(wthr.current.temp_f)}° F`;
                    } else {
                      return `${Math.ceil(wthr.current.temp_c)}° C`;
                    }
                  },
                ),
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
          label: theWeather.bind("value").as((v) => v.current.condition.text),
        }),
      }),
    ],
  });
};
