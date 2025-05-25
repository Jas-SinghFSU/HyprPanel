import { opt } from 'src/lib/options';
import { UnitType } from 'src/lib/units/temperature/types';

export default {
    time: {
        military: opt(false),
        hideSeconds: opt(false),
    },
    weather: {
        enabled: opt(true),
        interval: opt(60000),
        unit: opt<UnitType>('imperial'),
        location: opt('Los Angeles'),
        key: opt<string>(''),
    },
};
