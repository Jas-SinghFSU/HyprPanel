import { HourlyIcon } from './icon/index.js';
import { HourlyTemp } from './temperature/index.js';
import { HourlyTime } from './time/index.js';
import { Gtk } from 'astal/gtk3';

export const HourlyTemperature = (): JSX.Element => {
    return (
        <box className={'hourly-weather-container'} halign={Gtk.Align.FILL} vertical={false} hexpand>
            {[1, 2, 3, 4].map((hoursFromNow) => (
                <box className={'hourly-weather-item'} hexpand vertical>
                    <HourlyTime hoursFromNow={hoursFromNow} />
                    <HourlyIcon hoursFromNow={hoursFromNow} />
                    <HourlyTemp hoursFromNow={hoursFromNow} />
                </box>
            ))}
        </box>
    );
};
