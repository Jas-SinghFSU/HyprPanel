import { opt } from 'src/lib/options';

export default {
    custom_title: opt(true),
    title_map: opt([]),
    class_name: opt(true),
    label: opt(true),
    icon: opt(true),
    truncation: opt(true),
    truncation_size: opt(50),
    leftClick: opt(''),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
