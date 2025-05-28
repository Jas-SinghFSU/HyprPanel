import { opt } from 'src/lib/options';
import { UnitType } from 'src/lib/units/temperature/types';

export default {
    label: opt(true),
    unit: opt<UnitType>('imperial'),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
