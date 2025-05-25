import { bind, Variable } from 'astal';
import { Astal } from 'astal/gtk3';
import { systemTime } from 'src/lib/units/time';
import { GLib } from 'astal';
import { Module } from '../../shared/module';
import { BarBoxChild } from 'src/components/bar/types';
import options from 'src/configuration';
import { InputHandlerService } from '../../utils/input/inputHandler';

const inputHandler = InputHandlerService.getInstance();

const {
    format,
    formatDiffDate,
    divider,
    tz,
    icon,
    showIcon,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.worldclock;

export const WorldClock = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(icon), bind(showIcon)], (timeIcon, showTimeIcon) => {
        if (!showTimeIcon) {
            return '';
        }

        return timeIcon;
    });

    const timeBinding = Variable.derive(
        [systemTime, format, formatDiffDate, tz, divider],
        (localSystemTime, timeFormat, differentDayFormat, targetTimeZones, timeDivider) =>
            targetTimeZones
                .map((timeZoneId) => {
                    const targetTimezone = GLib.TimeZone.new(timeZoneId);
                    const timeInTargetZone = localSystemTime.to_timezone(targetTimezone);

                    if (timeInTargetZone === null) {
                        return 'Invalid TimeZone';
                    }

                    const isTargetZoneSameDay =
                        timeInTargetZone.get_day_of_year() === localSystemTime.get_day_of_year();
                    const formatForTimeZone = isTargetZoneSameDay ? timeFormat : differentDayFormat;

                    return timeInTargetZone.format(formatForTimeZone);
                })
                .join(timeDivider),
    );

    let inputHandlerBindings: Variable<void>;

    const microphoneModule = Module({
        textIcon: iconBinding(),
        label: timeBinding(),
        boxClass: 'worldclock',
        props: {
            setup: (self: Astal.Button) => {
                inputHandlerBindings = inputHandler.attachHandlers(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        cmd: scrollUp,
                    },
                    onScrollDown: {
                        cmd: scrollDown,
                    },
                });
            },
            onDestroy: () => {
                inputHandlerBindings.drop();
                timeBinding.drop();
                iconBinding.drop();
            },
        },
    });

    return microphoneModule;
};
