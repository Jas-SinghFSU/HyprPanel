import { Weather } from 'lib/types/weather';
import { Child } from 'lib/types/widget';
import { Variable } from 'types/variable';
import Label from 'types/widgets/label';
import { getNextEpoch } from '../utils';

export const HourlyTime = (theWeather: Variable<Weather>, hoursFromNow: number): Label<Child> => {
    return Widget.Label({
        class_name: 'hourly-weather-time',
        label: theWeather.bind('value').as((w) => {
            if (!Object.keys(w).length) {
                return '-';
            }

            const nextEpoch = getNextEpoch(w, hoursFromNow);
            const dateAtEpoch = new Date(nextEpoch * 1000);
            let hours = dateAtEpoch.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;

            return `${hours}${ampm}`;
        }),
    });
};
