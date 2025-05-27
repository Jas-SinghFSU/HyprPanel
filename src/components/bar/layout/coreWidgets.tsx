import { BatteryLabel } from '../modules/battery';
import { Bluetooth } from '../modules/bluetooth';
import { Cava } from '../modules/cava';
import { Clock } from '../modules/clock';
import { Cpu } from '../modules/cpu';
import { CpuTemp } from '../modules/cputemp';
import { Hypridle } from '../modules/hypridle';
import { Hyprsunset } from '../modules/hyprsunset';
import { KbInput } from '../modules/kblayout';
import { Media } from '../modules/media';
import { Menu } from '../modules/menu';
import { Microphone } from '../modules/microphone';
import { Netstat } from '../modules/netstat';
import { Network } from '../modules/network';
import { Notifications } from '../modules/notifications';
import { Power } from '../modules/power';
import { Ram } from '../modules/ram';
import { ModuleSeparator } from '../modules/separator';
import { Storage } from '../modules/storage';
import { Submap } from '../modules/submap';
import { SysTray } from '../modules/systray';
import { Updates } from '../modules/updates';
import { Volume } from '../modules/volume';
import { Weather } from '../modules/weather';
import { ClientTitle } from '../modules/window_title';
import { Workspaces } from '../modules/workspaces';
import { WorldClock } from '../modules/worldclock';
import { WidgetContainer } from '../shared/widgetContainer';
import { WidgetFactory } from './WidgetRegistry';

export function getCoreWidgets(): Record<string, WidgetFactory> {
    return {
        battery: () => WidgetContainer(BatteryLabel()),
        dashboard: () => WidgetContainer(Menu()),
        workspaces: (monitor: number) => WidgetContainer(Workspaces(monitor)),
        windowtitle: () => WidgetContainer(ClientTitle()),
        media: () => WidgetContainer(Media()),
        notifications: () => WidgetContainer(Notifications()),
        volume: () => WidgetContainer(Volume()),
        network: () => WidgetContainer(Network()),
        bluetooth: () => WidgetContainer(Bluetooth()),
        clock: () => WidgetContainer(Clock()),
        systray: () => WidgetContainer(SysTray()),
        microphone: () => WidgetContainer(Microphone()),
        ram: () => WidgetContainer(Ram()),
        cpu: () => WidgetContainer(Cpu()),
        cputemp: () => WidgetContainer(CpuTemp()),
        storage: () => WidgetContainer(Storage()),
        netstat: () => WidgetContainer(Netstat()),
        kbinput: () => WidgetContainer(KbInput()),
        updates: () => WidgetContainer(Updates()),
        submap: () => WidgetContainer(Submap()),
        weather: () => WidgetContainer(Weather()),
        power: () => WidgetContainer(Power()),
        hyprsunset: () => WidgetContainer(Hyprsunset()),
        hypridle: () => WidgetContainer(Hypridle()),
        cava: () => WidgetContainer(Cava()),
        worldclock: () => WidgetContainer(WorldClock()),
        separator: () => ModuleSeparator(),
    };
}
