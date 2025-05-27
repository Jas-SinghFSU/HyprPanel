import { CustomModules } from '../customModules';

export type WidgetFactory = (monitor: number) => JSX.Element;

/**
 * Manages registration and creation of widgets
 */
export class WidgetRegistry {
    private _widgets: Record<string, WidgetFactory> = {};
    private _initialized = false;

    constructor(coreWidgets: Record<string, WidgetFactory>) {
        this._widgets = { ...coreWidgets };
    }

    /**
     * Initialize the registry with core and custom widgets
     */
    public async initialize(): Promise<void> {
        if (this._initialized) return;

        try {
            const customWidgets = await CustomModules.build();

            this._widgets = {
                ...this._widgets,
                ...customWidgets,
            };

            this._initialized = true;
        } catch (error) {
            console.error('Failed to initialize widget registry:', error);
            throw error;
        }
    }

    /**
     * Check if a widget is registered
     */
    public hasWidget(name: string): boolean {
        return Object.keys(this._widgets).includes(name);
    }

    /**
     * Create an instance of a widget
     */
    public createWidget(name: string, monitor: number): JSX.Element {
        if (!this.hasWidget(name)) {
            console.error(`Widget "${name}" not found`);
            return <box />;
        }

        return this._widgets[name](monitor);
    }
}
