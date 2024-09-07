import { Weather } from "lib/types/weather.js";
import { Variable } from "types/variable.js";
import { weatherIcons } from "modules/icons/weather.js";

export const HourlyIcon = (theWeather: Variable<Weather>, getNextEpoch: any) => {
    const getIconQuery = (wthr: Weather) => {

        const nextEpoch = getNextEpoch(wthr);
        const weatherAtEpoch = wthr.forecast.forecastday[0].hour.find(
            (h) => h.time_epoch === nextEpoch,
        );

        let iconQuery = weatherAtEpoch?.condition.text
            .trim()
            .toLowerCase()
            .replaceAll(" ", "_")
            || "warning"
            ;

        if (!weatherAtEpoch?.is_day && iconQuery === "partly_cloudy") {
            iconQuery = "partly_cloudy_night";
        }
        return iconQuery;
    }

    return Widget.Box({
        hpack: "center",
        child: theWeather.bind("value").as((w) => {
            let weatherIcn = "-";

            const iconQuery = getIconQuery(w);
            weatherIcn = weatherIcons[iconQuery];
            return Widget.Label({
                hpack: "center",
                class_name: "hourly-weather-icon txt-icon",
                label: weatherIcn,
            });
        })

    })
};
