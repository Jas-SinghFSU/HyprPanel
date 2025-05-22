import { opt } from 'src/lib/options';

export default {
    label: opt(true),
    mutedIcon: opt('󰍭'),
    unmutedIcon: opt('󰍬'),
    leftClick: opt('menu:audio'),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
