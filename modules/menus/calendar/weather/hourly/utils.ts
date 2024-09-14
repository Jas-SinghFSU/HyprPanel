import { Weather } from 'lib/types/weather';

export const getNextEpoch = (wthr: Weather, hoursFromNow: number): number => {
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
        nextEpoch = 3600 * hoursFromNow + epochAtHourStart - hoursToRewind * 3600;
    }
    return nextEpoch;
};
