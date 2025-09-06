import { opt } from 'src/lib/options';
import { AutoHide } from 'src/lib/options/types';
import cava from './cava';
import clock from './clock';
import cpu from './cpu';
import cpuTemp from './cpuTemp';
import hypridle from './hypridle';
import hyprsunset from './hyprsunset';
import kbLayout from './kbLayout';
import launcher from './launcher';
import layouts from './layouts';
import microphone from './microphone';
import netstat from './netstat';
import power from './power';
import ram from './ram';
import storage from './storage';
import submap from './submap';
import updates from './updates';
import volume from './volume';
import weather from './weather';
import worldclock from './worldclock';

export default {
    scrollSpeed: opt(5),
    autoHide: opt<AutoHide>('never'),
    layouts,
    launcher,
    volume,
    clock,
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
