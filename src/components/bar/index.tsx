import {
    Menu,
    Workspaces,
    ClientTitle,
    Media,
    Notifications,
    Volume,
    Network,
    Bluetooth,
    BatteryLabel,
    Clock,
    SysTray,
    Microphone,
    Ram,
    Cpu,
    CpuGraph,
    CpuTemp,
    Storage,
    Netstat,
    KbInput,
    Updates,
    Submap,
    Weather,
    Power,
    Hyprsunset,
    Hypridle,
    Cava,
    WorldClock,
    ModuleSeparator,
} from './exports';

import { WidgetContainer } from './shared/WidgetContainer';
import options from 'src/options';
import { App, Gtk } from 'astal/gtk3';

import Astal from 'gi://Astal?version=3.0';
import { bind, Variable } from 'astal';
import { getLayoutForMonitor, isLayoutEmpty } from './utils/monitors';
import { GdkMonitorMapper } from './utils/GdkMonitorMapper';
import { CustomModules } from './custom_modules/CustomModules';

const { layouts } = options.bar;
const { location } = options.theme.bar;
const { location: borderLocation } = options.theme.bar.border;

let widgets: WidgetMap = {
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
    cpugraph: () => WidgetContainer(CpuGraph()),
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

const gdkMonitorMapper = new GdkMonitorMapper();

export const Bar = async (monitor: number): Promise<JSX.Element> => {
    try {
        const customWidgets = await CustomModules.build();
        widgets = {
            ...widgets,
            ...customWidgets,
        };
    } catch (error) {
        console.log(error);
    }
    const hyprlandMonitor = gdkMonitorMapper.mapGdkToHyprland(monitor);

    const computeVisibility = bind(layouts).as(() => {
        const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.get());
        return !isLayoutEmpty(foundLayout);
    });

    const computeClassName = bind(layouts).as(() => {
        const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.get());
        return !isLayoutEmpty(foundLayout) ? `bar` : '';
    });

    const computeAnchor = bind(location).as((loc) => {
        if (loc === 'bottom') {
            return Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT;
        }

        return Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT;
    });

    const computeLayer = Variable.derive([bind(options.theme.bar.layer), bind(options.tear)], (barLayer, tear) => {
        if (tear && barLayer === 'overlay') {
            return Astal.Layer.TOP;
        }
        const layerMap = {
            overlay: Astal.Layer.OVERLAY,
            top: Astal.Layer.TOP,
            bottom: Astal.Layer.BOTTOM,
            background: Astal.Layer.BACKGROUND,
        };

        return layerMap[barLayer];
    });

    const computeBorderLocation = bind(borderLocation).as((brdrLcn) =>
        brdrLcn !== 'none' ? 'bar-panel withBorder' : 'bar-panel',
    );

    const leftBinding = Variable.derive([bind(layouts)], (currentLayouts) => {
        const foundLayout = getLayoutForMonitor(hyprlandMonitor, currentLayouts);

        return foundLayout.left
            .filter((mod) => Object.keys(widgets).includes(mod))
            .map((w) => widgets[w](hyprlandMonitor));
    });
    const middleBinding = Variable.derive([bind(layouts)], (currentLayouts) => {
        const foundLayout = getLayoutForMonitor(hyprlandMonitor, currentLayouts);

        return foundLayout.middle
            .filter((mod) => Object.keys(widgets).includes(mod))
            .map((w) => widgets[w](hyprlandMonitor));
    });
    const rightBinding = Variable.derive([bind(layouts)], (currentLayouts) => {
        const foundLayout = getLayoutForMonitor(hyprlandMonitor, currentLayouts);

        return foundLayout.right
            .filter((mod) => Object.keys(widgets).includes(mod))
            .map((w) => widgets[w](hyprlandMonitor));
    });

    return (
        <window
            inhibit={bind(idleInhibit)}
            name={`bar-${hyprlandMonitor}`}
            namespace={`bar-${hyprlandMonitor}`}
            className={computeClassName}
            application={App}
            monitor={monitor}
            visible={computeVisibility}
            anchor={computeAnchor}
            layer={computeLayer()}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            onDestroy={() => {
                computeLayer.drop();
                leftBinding.drop();
                middleBinding.drop();
                rightBinding.drop();
            }}
        >
            <box className={'bar-panel-container'}>
                <centerbox
                    css={'padding: 1px;'}
                    hexpand
                    className={computeBorderLocation}
                    startWidget={
                        <box className={'box-left'} hexpand>
                            {leftBinding()}
                        </box>
                    }
                    centerWidget={
                        <box className={'box-center'} halign={Gtk.Align.CENTER}>
                            {middleBinding()}
                        </box>
                    }
                    endWidget={
                        <box className={'box-right'} halign={Gtk.Align.END}>
                            {rightBinding()}
                        </box>
                    }
                />
            </box>
        </window>
    );
};

export type WidgetMap = {
    [K in string]: (monitor: number) => JSX.Element;
};
