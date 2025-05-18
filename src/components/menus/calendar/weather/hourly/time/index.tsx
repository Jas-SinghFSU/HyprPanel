import options from 'src/options';
import { globalWeatherVar } from 'src/shared/weather';
import { getNextEpoch } from '../helpers';
import { bind, Variable } from 'astal';

const { military } = options.menus.clock.time;

export const HourlyTime = ({ hoursFromNow }: HourlyTimeProps): JSX.Element => {
    const weatherBinding = Variable.derive([bind(globalWeatherVar), bind(military)], (weather, military) => {
        if (!Object.keys(weather).length) {
            return '-';
        }

        const nextEpoch = getNextEpoch(weather, hoursFromNow);
        const dateAtEpoch = new Date(nextEpoch * 1000);

        let hours = dateAtEpoch.getHours();

        if (military) {
            return `${hours}:00`;
        }

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}${ampm}`;
    });

    return (
        <label
            className={'hourly-weather-time'}
            label={weatherBinding()}
            onDestroy={() => {
                weatherBinding.drop();
            }}
        />
    );
};

interface HourlyTimeProps {
    hoursFromNow: number;
}
