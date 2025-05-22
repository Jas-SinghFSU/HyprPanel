import { opt } from 'src/lib/options';

export default {
    icon: opt('󱉊'),
    showIcon: opt(true),
    format: opt('%I:%M:%S %p %Z'),
    formatDiffDate: opt('%a %b %d  %I:%M:%S %p %Z'),
    divider: opt('  '),
    leftClick: opt('menu:calendar'),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
    tz: opt(['America/New_York', 'Europe/Paris', 'Asia/Tokyo']),
};
