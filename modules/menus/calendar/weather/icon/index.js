import icons from "../../../../icons/index.js";

export const TodayIcon = (theWeather) => {
  return Widget.Box({
    vpack: "center",
    hpack: "start",
    class_name: "calendar-menu-weather today icon container",
    children: [
      Widget.Icon({
        class_name: "calendar-menu-weather today icon",
        icon: theWeather.bind("value").as((v) => {
          let iconQuery = v.current.condition.text
            .trim()
            .toLowerCase()
            .replaceAll(" ", "_");

          if (!v.current.isDay && iconQuery === "partly_cloudy") {
            iconQuery = "partly_cloudy_night";
          }
          return icons.weather[iconQuery];
        }),
      }),
    ],
  });
};
