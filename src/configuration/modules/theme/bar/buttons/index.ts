import { opt } from 'src/lib/options';
import { BarButtonStyles } from 'src/lib/options/types';
import { primaryColors } from '../../colors/primary';
import dashboard from './dashboard';
import workspaces from './workspaces';
import windowtitle from './windowtitle';
import media from './media';
import volume from './volume';
import network from './network';
import bluetooth from './bluetooth';
import systray from './systray';
import battery from './battery';
import clock from './clock';
import notifications from './notifications';
import separator from './separator';
import worldclock from './worldclock';
import cava from './cava';
import hypridle from './hypridle';
import hyprsunset from './hyprsunset';
import submap from './submap';
import power from './power';
import weather from './weather';
import updates from './updates';
import kbLayout from './kbLayout';
import netstat from './netstat';
import storage from './storage';
import cpuTemp from './cpuTemp';
import cpu from './cpu';
import ram from './ram';
import microphone from './microphone';

export default {
    style: opt<BarButtonStyles>('default'),
    enableBorders: opt(false),
    borderSize: opt('0.1em'),
    borderColor: opt(primaryColors.lavender),
    monochrome: opt(false),
    spacing: opt('0.25em'),
    padding_x: opt('0.7rem'),
    padding_y: opt('0.2rem'),
    y_margins: opt('0.4em'),
    radius: opt('0.3em'),
    innerRadiusMultiplier: opt('0.4'),
    opacity: opt(100),
    background_opacity: opt(100),
    background_hover_opacity: opt(100),
    background: opt(primaryColors.base2),
    icon_background: opt(primaryColors.base2),
    hover: opt(primaryColors.surface1),
    text: opt(primaryColors.lavender),
    icon: opt(primaryColors.lavender),
    dashboard: dashboard,
    workspaces: workspaces,
    windowtitle: windowtitle,
    media: media,
    volume: volume,
    network: network,
    bluetooth: bluetooth,
    systray: systray,
    battery: battery,
    clock: clock,
    notifications: notifications,
    separator: separator,
    modules: {
        microphone: microphone,
        ram: ram,
        cpu: cpu,
        cpuTemp: cpuTemp,
        storage: storage,
        netstat: netstat,
        kbLayout: kbLayout,
        updates: updates,
        weather: weather,
        power: power,
        submap: submap,
        hyprsunset: hyprsunset,
        hypridle: hypridle,
        cava: cava,
        worldclock: worldclock,
    },
};
