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

    // Custom Modules
    Ram,
    Cpu,
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
} from './exports';

import { BarItemBox as WidgetContainer } from 'src/components/bar/shared/barItemBox';
import options from 'src/options';
import { App, Gtk } from 'astal/gtk3/index';

import Astal from 'gi://Astal?version=3.0';
import { bind, Variable } from 'astal';
import { gdkMonitorIdToHyprlandId, getLayoutForMonitor, isLayoutEmpty } from './utils/monitors';
import { useHook } from 'src/lib/shared/hookHandler';

const { layouts } = options.bar;
const { location } = options.theme.bar;
const { location: borderLocation } = options.theme.bar.border;

const widget = {
    battery: (): JSX.Element => WidgetContainer(BatteryLabel()),
    dashboard: (): JSX.Element => WidgetContainer(Menu()),
    workspaces: (monitor: number): JSX.Element => WidgetContainer(Workspaces(monitor)),
    windowtitle: (): JSX.Element => WidgetContainer(ClientTitle()),
    media: (): JSX.Element => WidgetContainer(Media()),
    notifications: (): JSX.Element => WidgetContainer(Notifications()),
    volume: (): JSX.Element => WidgetContainer(Volume()),
    network: (): JSX.Element => WidgetContainer(Network()),
    bluetooth: (): JSX.Element => WidgetContainer(Bluetooth()),
    clock: (): JSX.Element => WidgetContainer(Clock()),
    systray: (): JSX.Element => WidgetContainer(SysTray()),
    ram: (): JSX.Element => WidgetContainer(Ram()),
    cpu: (): JSX.Element => WidgetContainer(Cpu()),
    cputemp: (): JSX.Element => WidgetContainer(CpuTemp()),
    storage: (): JSX.Element => WidgetContainer(Storage()),
    netstat: (): JSX.Element => WidgetContainer(Netstat()),
    kbinput: (): JSX.Element => WidgetContainer(KbInput()),
    updates: (): JSX.Element => WidgetContainer(Updates()),
    submap: (): JSX.Element => WidgetContainer(Submap()),
    weather: (): JSX.Element => WidgetContainer(Weather()),
    power: (): JSX.Element => WidgetContainer(Power()),
    hyprsunset: (): JSX.Element => WidgetContainer(Hyprsunset()),
    hypridle: (): JSX.Element => WidgetContainer(Hypridle()),
};

export const Bar = (() => {
    const usedHyprlandMonitors = new Set<number>();

    return (monitor: number): JSX.Element => {
        const hyprlandMonitor = gdkMonitorIdToHyprlandId(monitor, usedHyprlandMonitors);

        const computeVisibility = bind(layouts).as(() => {
            const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.get());
            return !isLayoutEmpty(foundLayout);
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

        const computeBorderLocation = borderLocation
            .bind()
            .as((brdrLcn) => (brdrLcn !== 'none' ? 'bar-panel withBorder' : 'bar-panel'));

        const leftSection = (self: Astal.Box): void => {
            useHook(self, layouts, () => {
                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.get());

                self.children = foundLayout.left
                    .filter((mod) => Object.keys(widget).includes(mod))
                    .map((w) => widget[w](hyprlandMonitor));
            });
        };

        const middleSection = (self: Astal.Box): void => {
            useHook(self, layouts, () => {
                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.get());

                self.children = foundLayout.middle
                    .filter((mod) => Object.keys(widget).includes(mod))
                    .map((w) => widget[w](hyprlandMonitor));
            });
        };

        const rightSection = (self: Astal.Box): void => {
            useHook(self, layouts, () => {
                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.get());
                self.children = foundLayout.right
                    .filter((mod) => Object.keys(widget).includes(mod))
                    .map((w) => widget[w](hyprlandMonitor));
            });
        };

        return (
            <window
                name={`bar-${hyprlandMonitor}`}
                className={'bar'}
                application={App}
                monitor={monitor}
                visible={computeVisibility}
                anchor={computeAnchor}
                layer={computeLayer()}
                exclusivity={Astal.Exclusivity.EXCLUSIVE}
                onDestroy={() => {
                    computeLayer.drop();
                }}
            >
                <box className={'bar-panel-container'}>
                    <centerbox
                        css={'padding: 1px;'}
                        hexpand
                        className={computeBorderLocation}
                        startWidget={<box className={'box-left'} hexpand setup={leftSection}></box>}
                        centerWidget={
                            <box
                                className={'box-center'}
                                halign={Gtk.Align.CENTER}
                                setup={(self) => {
                                    middleSection(self);
                                }}
                            ></box>
                        }
                        endWidget={<box className={'box-right'} halign={Gtk.Align.END} setup={rightSection}></box>}
                    />
                </box>
            </window>
        );
    };
})();
