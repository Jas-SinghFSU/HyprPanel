import { Weather } from "lib/types/weather";
import { Variable } from "types/variable";
import icons from "../../../../icons/index.js";

export const TodayIcon = (theWeather: Variable<Weather>) => {
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

                    if (!v.current.is_day && iconQuery === "partly_cloudy") {
                        iconQuery = "partly_cloudy_night";
                    }
                    return icons.weather[iconQuery];
                }),
            }),
        ],
    });
};
