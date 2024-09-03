import { Weather } from "lib/types/weather";
import { Variable } from "types/variable";
import { getWeatherStatusIcon } from "globals/weather.js";

export const TodayIcon = (theWeather: Variable<Weather>) => {
    return Widget.Box({
        vpack: "center",
        hpack: "start",
        class_name: "calendar-menu-weather today icon container",
        children: [
            Widget.Icon({
                class_name: "calendar-menu-weather today icon",
                icon: theWeather.bind("value").as((v) => {
                    return getWeatherStatusIcon(v);
                }),
            }),
        ],
    });
};
