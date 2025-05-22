import { opt } from 'src/lib/options';
import { UnitType } from 'src/lib/types/shared/unit.types';

export default {
    icon: opt(''),
    sensor: opt(''),
    label: opt(true),
    round: opt(true),
    showUnit: opt(true),
    unit: opt<UnitType>('metric'),
    pollingInterval: opt(2000),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
