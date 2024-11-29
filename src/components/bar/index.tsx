import {
    Menu,
    // Workspaces,
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

import { BarItemBox as WidgetContainer } from 'src/components/bar/utils/barItemBox';
import options from 'src/options';
import { Gtk } from 'astal/gtk3/index';

import { GtkWidget } from '../../lib/types/widget';
import Astal from 'gi://Astal?version=3.0';
import { bind, Variable } from 'astal';
import { gdkMonitorIdToHyprlandId, getLayoutForMonitor, isLayoutEmpty } from './utils/monitors';
import { useHook } from 'src/lib/shared/hookHandler';

const { layouts } = options.bar;
// const { location } = options.theme.bar;
const { location: borderLocation } = options.theme.bar.border;

const widget = {
    // battery: (): GtkWidget => WidgetContainer(BatteryLabel()),
    dashboard: (): GtkWidget => WidgetContainer(Menu()),
    // workspaces: (monitor: number): GtkWidget => WidgetContainer(Workspaces(monitor)),
    windowtitle: (): GtkWidget => WidgetContainer(ClientTitle()),
    media: (): GtkWidget => WidgetContainer(Media()),
    notifications: (): GtkWidget => WidgetContainer(Notifications()),
    volume: (): GtkWidget => WidgetContainer(Volume()),
    network: (): GtkWidget => WidgetContainer(Network()),
    bluetooth: (): GtkWidget => WidgetContainer(Bluetooth()),
    clock: (): GtkWidget => WidgetContainer(Clock()),
    systray: (): GtkWidget => WidgetContainer(SysTray()),
    ram: (): GtkWidget => WidgetContainer(Ram()),
    cpu: (): GtkWidget => WidgetContainer(Cpu()),
    cputemp: (): GtkWidget => WidgetContainer(CpuTemp()),
    storage: (): GtkWidget => WidgetContainer(Storage()),
    netstat: (): GtkWidget => WidgetContainer(Netstat()),
    kbinput: (): GtkWidget => WidgetContainer(KbInput()),
    updates: (): GtkWidget => WidgetContainer(Updates()),
    submap: (): GtkWidget => WidgetContainer(Submap()),
    weather: (): GtkWidget => WidgetContainer(Weather()),
    power: (): GtkWidget => WidgetContainer(Power()),
    hyprsunset: (): GtkWidget => WidgetContainer(Hyprsunset()),
    hypridle: (): GtkWidget => WidgetContainer(Hypridle()),
};

export const Bar = (() => {
    const usedHyprlandMonitors = new Set<number>();

    return (monitor: number): GtkWidget => {
        const hyprlandMonitor = gdkMonitorIdToHyprlandId(monitor, usedHyprlandMonitors);

        const computeVisibility = bind(layouts).as(() => {
            const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.value);
            return !isLayoutEmpty(foundLayout);
        });

        const computeAnchor = bind(options.theme.bar.location).as((loc) => {
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

        const leftSection = (self: GtkWidget): void => {
            useHook(self, layouts, () => {
                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.value);

                self.children = foundLayout.left
                    .filter((mod) => Object.keys(widget).includes(mod))
                    .map((w) => widget[w](hyprlandMonitor) as GtkWidget);
            });
        };

        const middleSection = (self: GtkWidget): void => {
            useHook(self, layouts, () => {
                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.value);

                self.children = foundLayout.middle
                    .filter((mod) => Object.keys(widget).includes(mod))
                    .map((w) => widget[w](hyprlandMonitor) as GtkWidget);
            });
        };

        const rightSection = (self: GtkWidget): void => {
            useHook(self, layouts, () => {
                const foundLayout = getLayoutForMonitor(hyprlandMonitor, layouts.value);
                self.children = foundLayout.right
                    .filter((mod) => Object.keys(widget).includes(mod))
                    .map((w) => widget[w](hyprlandMonitor) as GtkWidget);
            });
        };

        return (
            <window
                name={`bar-${hyprlandMonitor}`}
                className={'bar'}
                monitor={monitor}
                visible={computeVisibility}
                anchor={computeAnchor}
                layer={computeLayer()}
                exclusivity={Astal.Exclusivity.EXCLUSIVE}
            >
                <box className={'bar-panel-container'}>
                    <centerbox
                        css={'padding: 1px;'}
                        hexpand={true}
                        className={computeBorderLocation}
                        startWidget={<box className={'box-left'} hexpand={true} setup={leftSection}></box>}
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
