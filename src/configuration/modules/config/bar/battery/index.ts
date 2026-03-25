import { opt } from 'src/lib/options';

export default {
    label: opt(true),
    hideLabelWhenFull: opt(false),
    hideModuleWhenNoBatteryFound: opt(false),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
