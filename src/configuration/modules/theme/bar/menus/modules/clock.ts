import { opt } from 'src/lib/options';
import { primaryColors } from '../../../colors/primary';
import { secondaryColors } from '../../../colors/secondary';

export default {
    scaling: opt(100),
    card: {
        color: opt(primaryColors.base),
    },
    background: {
        color: opt(primaryColors.crust),
    },
    border: {
        color: opt(primaryColors.surface0),
    },
    text: opt(primaryColors.text),
    time: {
        time: opt(primaryColors.pink),
        timeperiod: opt(primaryColors.teal),
    },
    calendar: {
        yearmonth: opt(primaryColors.teal),
        weekdays: opt(primaryColors.pink),
        paginator: opt(secondaryColors.pink),
        currentday: opt(primaryColors.pink),
        days: opt(primaryColors.text),
        contextdays: opt(primaryColors.surface2),
    },
    weather: {
        icon: opt(primaryColors.pink),
        temperature: opt(primaryColors.text),
        status: opt(primaryColors.teal),
        stats: opt(primaryColors.pink),
        thermometer: {
            extremelyhot: opt(primaryColors.red),
            hot: opt(primaryColors.peach),
            moderate: opt(primaryColors.lavender),
            cold: opt(primaryColors.blue),
            extremelycold: opt(primaryColors.sky),
        },
        hourly: {
            time: opt(primaryColors.pink),
            icon: opt(primaryColors.pink),
            temperature: opt(primaryColors.pink),
        },
    },
};
