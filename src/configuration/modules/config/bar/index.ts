import { opt } from 'src/lib/options';
import { AutoHide } from 'src/lib/options/types';
import battery from './battery';
import bluetooth from './bluetooth';
import cava from './cava';
import clock from './clock';
import cpu from './cpu';
import cpuTemp from './cpuTemp';
import hypridle from './hypridle';
import hyprsunset from './hyprsunset';
import kbLayout from './kbLayout';
import launcher from './launcher';
import layouts from './layouts';
import media from './media';
import microphone from './microphone';
import netstat from './netstat';
import network from './network';
import notifications from './notifications';
import power from './power';
import ram from './ram';
import storage from './storage';
import submap from './submap';
import systray from './systray';
import updates from './updates';
import volume from './volume';
import weather from './weather';
import windowtitle from './windowtitle';
import workspaces from './workspaces';
import worldclock from './worldclock';

export default {
    scrollSpeed: opt(5),
    autoHide: opt<AutoHide>('never'),
    layouts,
    launcher,
    windowtitle,
    workspaces,
    volume,
    network,
    bluetooth,
    battery,
    systray,
    clock,
    media,
    notifications,
    customModules: {
        scrollSpeed: opt(5),
        microphone,
        ram,
        cpu,
        cpuTemp,
        storage,
        netstat,
        kbLayout,
        updates,
        submap,
        weather,
        power,
        hyprsunset,
        hypridle,
        cava,
        worldclock,
    },
};
