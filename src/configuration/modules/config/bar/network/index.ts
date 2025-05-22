import { opt } from 'src/lib/options';

export default {
    truncation: opt(true),
    showWifiInfo: opt(false),
    truncation_size: opt(7),
    label: opt(true),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
