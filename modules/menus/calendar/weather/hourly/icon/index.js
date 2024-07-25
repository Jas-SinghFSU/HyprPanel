import icons from "../../../../../icons/index.js";

export const HourlyIcon = (theWeather, getNextEpoch) => {
    return Widget.Icon({
        class_name: "hourly-weather-icon",
        icon: theWeather.bind("value").as((w) => {
            if (!Object.keys(w).length) {
                return "-";
            }

            const nextEpoch = getNextEpoch(w);
            const weatherAtEpoch = w.forecast.forecastday[0].hour.find(
                (h) => h.time_epoch === nextEpoch,
            );

            let iconQuery = weatherAtEpoch?.condition.text
                .trim()
                .toLowerCase()
                .replaceAll(" ", "_");

            if (!weatherAtEpoch?.isDay && iconQuery === "partly_cloudy") {
                iconQuery = "partly_cloudy_night";
            }

            return icons.weather[iconQuery];
        }),
    });
};
