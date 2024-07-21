import options from "options";

const { unit } = options.menus.clock.weather;

export const HourlyTemp = (theWeather, getNextEpoch) => {
  return Widget.Label({
    class_name: "hourly-weather-temp",
    label: Utils.merge(
      [theWeather.bind("value"), unit.bind("value")],
      (wthr, unt) => {
        if (!Object.keys(wthr).length) {
          return "-";
        }

        const nextEpoch = getNextEpoch(wthr);
        const weatherAtEpoch = wthr.forecast.forecastday[0].hour.find(
          (h) => h.time_epoch === nextEpoch,
        );

        if (unt === "imperial") {
          return `${weatherAtEpoch ? Math.ceil(weatherAtEpoch.temp_f) : "-"}° F`;
        }
        return `${weatherAtEpoch ? Math.ceil(weatherAtEpoch.temp_c) : "-"}° C`;
      },
    ),
  });
};
