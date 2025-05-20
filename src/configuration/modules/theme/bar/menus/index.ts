import { opt } from 'src/lib/options';
import { primaryColors } from '../../colors/primary';
import components from './components';
import media from './modules/media';
import volume from './modules/volume';
import network from './modules/network';
import bluetooth from './modules/bluetooth';
import systray from './modules/systray';
import battery from './modules/battery';
import clock from './modules/clock';
import dashboard from './modules/dashboard';
import power from './modules/power';
import notifications from './modules/notifications';

export default {
    monochrome: opt(false),
    background: opt(primaryColors.crust),
    opacity: opt(100),
    cards: opt(primaryColors.base),
    card_radius: opt('0.4em'),
    enableShadow: opt(false),
    shadow: opt('0px 0px 3px 1px #16161e'),
    shadowMargins: opt('5px 5px'),
    text: opt(primaryColors.text),
    dimtext: opt(primaryColors.surface2),
    feinttext: opt(primaryColors.surface0),
    label: opt(primaryColors.lavender),
    ...components,
    menu: {
        media,
        volume,
        network,
        bluetooth,
        systray,
        battery,
        clock,
        dashboard,
        power,
        notifications,
    },
};
