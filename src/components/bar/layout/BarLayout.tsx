import { App, Gdk, Gtk } from 'astal/gtk3';
import Astal from 'gi://Astal?version=3.0';
import { bind, Binding, Variable } from 'astal';
import { idleInhibit } from 'src/lib/window/visibility';
import { WidgetRegistry } from './WidgetRegistry';
import { getLayoutForMonitor, isLayoutEmpty } from '../utils/monitors';
import options from 'src/configuration';
import { JSXElement } from 'src/core/types';

/**
 * Responsible for the bar UI layout and positioning
 */
export class BarLayout {
    private _hyprlandMonitor: number;
    private _gdkMonitor: number;
    private _widgetRegistry: WidgetRegistry;

    private _visibilityVar: Variable<boolean>;
    private _classNameVar: Variable<string>;
    private _anchorVar: Variable<Astal.WindowAnchor>;
    private _layerVar: Variable<Astal.Layer>;
    private _borderLocationVar: Binding<string>;
    private _barSectionsVar: {
        left: Variable<JSX.Element[]>;
        middle: Variable<JSX.Element[]>;
        right: Variable<JSX.Element[]>;
    };

    constructor(gdkMonitor: number, hyprlandMonitor: number, widgetRegistry: WidgetRegistry) {
        this._gdkMonitor = gdkMonitor;
        this._hyprlandMonitor = hyprlandMonitor;
        this._widgetRegistry = widgetRegistry;

        this._visibilityVar = Variable(true);
        this._classNameVar = Variable('bar');
        this._anchorVar = Variable(
            Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT,
        );
        this._layerVar = Variable(Astal.Layer.TOP);
        this._borderLocationVar = Variable('bar-panel')();
        this._barSectionsVar = {
            left: Variable([]),
            middle: Variable([]),
            right: Variable([]),
        };

        this._initializeReactiveVariables();
    }

    public render(): JSXElement {
        const display = Gdk.Display.get_default();
        if (!display) {
            console.error('[BarLayout] No display available for bar creation');
            return null;
        }

        const monitorCount = display.get_n_monitors();
        if (this._gdkMonitor < 0 || this._gdkMonitor >= monitorCount) {
            console.error(
                `[BarLayout] Invalid monitor index: ${this._gdkMonitor} (total monitors: ${monitorCount})`,
            );
            return null;
        }

        const monitor = display.get_monitor(this._gdkMonitor);
        if (monitor === null) {
            console.error(`[BarLayout] Monitor at index ${this._gdkMonitor} no longer exists`);
            return null;
        }

        return (
            <window
                inhibit={bind(idleInhibit)}
                name={`bar-${this._hyprlandMonitor}`}
                namespace={`bar-${this._hyprlandMonitor}`}
                className={this._classNameVar()}
                application={App}
                monitor={this._gdkMonitor}
                visible={this._visibilityVar()}
                anchor={this._anchorVar()}
                layer={this._layerVar()}
                exclusivity={bind(this._visibilityVar).as((visible) =>
                    visible ? Astal.Exclusivity.EXCLUSIVE : Astal.Exclusivity.NORMAL,
                )}
                onDestroy={() => this._cleanup()}
            >
                <box className="bar-panel-container">
                    <centerbox
                        css="padding: 1px;"
                        hexpand
                        className={this._borderLocationVar}
                        startWidget={
                            <box className="box-left" hexpand>
                                {this._barSectionsVar.left()}
                            </box>
                        }
                        centerWidget={
                            <box className="box-center" halign={Gtk.Align.CENTER}>
                                {this._barSectionsVar.middle()}
                            </box>
                        }
                        endWidget={
                            <box className="box-right" halign={Gtk.Align.END}>
                                {this._barSectionsVar.right()}
                            </box>
                        }
                    />
                </box>
            </window>
        );
    }

    private _initializeReactiveVariables(): void {
        this._initializeVisibilityVariables();
        this._initializePositionVariables();
        this._initializeAppearanceVariables();
        this._initializeSectionVariables();
    }

    private _initializeVisibilityVariables(): void {
        const { layouts } = options.bar;

        this._classNameVar = Variable.derive([bind(layouts)], (currentLayouts) => {
            const foundLayout = getLayoutForMonitor(this._hyprlandMonitor, currentLayouts);
            return !isLayoutEmpty(foundLayout) ? 'bar' : '';
        });
    }

    /**
     * Initialize variables related to bar positioning
     */
    private _initializePositionVariables(): void {
        const { location } = options.theme.bar;

        this._anchorVar = Variable.derive([bind(location)], (loc) => {
            if (loc === 'bottom') {
                return Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT;
            }
            return Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT;
        });
    }

    private _initializeAppearanceVariables(): void {
        const { location: borderLocation } = options.theme.bar.border;

        this._layerVar = this._createLayerVariable();

        this._borderLocationVar = bind(borderLocation).as((brdrLcn) =>
            brdrLcn !== 'none' ? 'bar-panel withBorder' : 'bar-panel',
        );
    }

    private _createLayerVariable(): Variable<Astal.Layer> {
        return Variable.derive([bind(options.theme.bar.layer), bind(options.tear)], (barLayer, tear) => {
            if (tear && barLayer === 'overlay') {
                return Astal.Layer.TOP;
            }

            return this._getLayerFromConfig(barLayer);
        });
    }

    private _getLayerFromConfig(barLayer: string): Astal.Layer {
        const layerMap: Record<string, Astal.Layer> = {
            overlay: Astal.Layer.OVERLAY,
            top: Astal.Layer.TOP,
            bottom: Astal.Layer.BOTTOM,
            background: Astal.Layer.BACKGROUND,
        };

        return layerMap[barLayer] ?? Astal.Layer.TOP;
    }

    private _initializeSectionVariables(): void {
        this._barSectionsVar = {
            left: this._createSectionBinding('left'),
            middle: this._createSectionBinding('middle'),
            right: this._createSectionBinding('right'),
        };

        this._visibilityVar = Variable.derive(
            [
                bind(this._barSectionsVar.left),
                bind(this._barSectionsVar.middle),
                bind(this._barSectionsVar.right),
            ],
            (left, middle, right) => {
                return left.length > 0 || middle.length > 0 || right.length > 0;
            },
        );
    }

    private _createSectionBinding(section: 'left' | 'middle' | 'right'): Variable<JSX.Element[]> {
        const { layouts } = options.bar;

        return Variable.derive([bind(layouts)], (currentLayouts) => {
            const foundLayout = getLayoutForMonitor(this._hyprlandMonitor, currentLayouts);
            return foundLayout[section]
                .filter((mod) => this._widgetRegistry.hasWidget(mod))
                .map((widget) => this._widgetRegistry.createWidget(widget, this._hyprlandMonitor));
        });
    }

    private _cleanup(): void {
        this._visibilityVar.drop();
        this._classNameVar.drop();
        this._anchorVar.drop();
        this._layerVar.drop();

        this._barSectionsVar.left.drop();
        this._barSectionsVar.middle.drop();
        this._barSectionsVar.right.drop();
    }
}
