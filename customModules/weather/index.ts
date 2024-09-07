import options from "options";
import { module } from "../module"

import { inputHandler } from "customModules/utils";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import Button from "types/widgets/button";
import { getWeatherStatusTextIcon, globalWeatherVar } from "globals/weather";

const {
    label,
    unit,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.weather;

export const Weather = () => {
    const weatherModule = module({
        textIcon: Utils.merge([globalWeatherVar.bind("value")], (wthr) => {
            const weatherStatusIcon = getWeatherStatusTextIcon(wthr);
            return weatherStatusIcon;
        }),
        tooltipText: globalWeatherVar.bind("value").as(v => `Weather Status: ${v.current.condition.text}`),
        boxClass: "weather-custom",
        label: Utils.merge(
            [globalWeatherVar.bind("value"), unit.bind("value")],
            (wthr, unt) => {
                if (unt === "imperial") {
                    return `${Math.ceil(wthr.current.temp_f)}° F`;
                } else {
                    return `${Math.ceil(wthr.current.temp_c)}° C`;
                }
            },
        ),
        showLabelBinding: label.bind("value"),
        props: {
            setup: (self: Button<Gtk.Widget, Gtk.Widget>) => {
                inputHandler(self, {
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
        },
    });

    return weatherModule;
}




