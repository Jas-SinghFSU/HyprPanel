import { HourlyIcon } from "./icon/index.js";
import { HourlyTemp } from "./temperature/index.js";
import { HourlyTime } from "./time/index.js";

export const Hourly = (theWeather) => {
  return Widget.Box({
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
            3600 * hoursFromNow + epochAtHourStart - hoursToRewind * 3600;
        }
        return nextEpoch;
      };

      return Widget.Box({
        class_name: "hourly-weather-item",
        hexpand: true,
        vertical: true,
        children: [
          HourlyTime(theWeather, getNextEpoch),
          HourlyIcon(theWeather, getNextEpoch),
          HourlyTemp(theWeather, getNextEpoch),
        ],
      });
    }),
  });
};
