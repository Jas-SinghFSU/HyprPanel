import { bind, Binding, Variable } from 'astal';
import { onMiddleClick, onPrimaryClick, onSecondaryClick } from 'src/lib/shared/eventHandlers';
import { Gdk } from 'astal/gtk3';
import { isScrollDown, isScrollUp } from 'src/lib/events/mouse';
import { throttledAsyncCommand, throttledScrollHandler } from './throttle';
import options from 'src/configuration';
import { InputHandlerEventArgs, InputHandlerEvents, UpdateHandlers } from './types';
import { GtkWidget } from '../../types';

type EventType = 'primary' | 'secondary' | 'middle';
type ClickHandler = typeof onPrimaryClick | typeof onSecondaryClick | typeof onMiddleClick;

interface EventConfig {
    event?: InputHandlerEventArgs;
    handler: ClickHandler;
}

/**
 * Service responsible for managing input userDefinedActions for widgets
 */
export class InputHandlerService {
    private static _instance: InputHandlerService;
    private readonly _EMPTY_CMD = Variable('');
    private readonly _scrollSpeed = options.bar.customModules.scrollSpeed;

    private constructor() {}

    public static getInstance(): InputHandlerService {
        if (this._instance === undefined) {
            this._instance = new InputHandlerService();
        }

        return this._instance;
    }

    /**
     * Attaches input handlers to a widget and manages their lifecycle
     */
    public attachHandlers(
        widget: GtkWidget,
        userDefinedActions: InputHandlerEvents,
        postInputUpdater?: Variable<boolean>,
        customScrollThreshold?: number,
    ): Variable<void> {
        const eventHandlers = this._createEventHandlers(
            widget,
            userDefinedActions,
            postInputUpdater,
            customScrollThreshold,
        );

        return this._setupBindings(
            widget,
            userDefinedActions,
            eventHandlers,
            postInputUpdater,
            customScrollThreshold,
        );
    }

    /**
     * Creates event handlers for the widget
     */
    private _createEventHandlers(
        widget: GtkWidget,
        userDefinedActions: InputHandlerEvents,
        postInputUpdater?: Variable<boolean>,
        customScrollThreshold?: number,
    ): UpdateHandlers {
        const clickHandlers = this._createClickHandlers(widget, userDefinedActions, postInputUpdater);
        const scrollHandler = this._createScrollHandler(
            widget,
            userDefinedActions,
            postInputUpdater,
            customScrollThreshold,
        );

        return {
            ...clickHandlers,
            ...scrollHandler,
        };
    }

    /**
     * Creates click event handlers (primary, secondary, middle)
     */
    private _createClickHandlers(
        widget: GtkWidget,
        userDefinedActions: InputHandlerEvents,
        postInputUpdater?: Variable<boolean>,
    ): Pick<UpdateHandlers, 'disconnectPrimary' | 'disconnectSecondary' | 'disconnectMiddle'> {
        const eventConfigs: Record<EventType, EventConfig> = {
            primary: { event: userDefinedActions.onPrimaryClick, handler: onPrimaryClick },
            secondary: { event: userDefinedActions.onSecondaryClick, handler: onSecondaryClick },
            middle: { event: userDefinedActions.onMiddleClick, handler: onMiddleClick },
        };

        return {
            disconnectPrimary: this._createClickHandler(widget, eventConfigs.primary, postInputUpdater),
            disconnectSecondary: this._createClickHandler(widget, eventConfigs.secondary, postInputUpdater),
            disconnectMiddle: this._createClickHandler(widget, eventConfigs.middle, postInputUpdater),
        };
    }

    /**
     * Creates a single click handler
     */
    private _createClickHandler(
        widget: GtkWidget,
        config: EventConfig,
        postInputUpdater?: Variable<boolean>,
    ): () => void {
        return config.handler(widget, (clicked: GtkWidget, event: Gdk.Event) => {
            throttledAsyncCommand(
                this._sanitizeInput(config.event?.cmd),
                { clicked, event },
                config.event?.fn,
                postInputUpdater,
            );
        });
    }

    /**
     * Creates scroll event handler
     */
    private _createScrollHandler(
        widget: GtkWidget,
        userDefinedActions: InputHandlerEvents,
        postInputUpdater?: Variable<boolean>,
        customScrollThreshold?: number,
    ): Pick<UpdateHandlers, 'disconnectScroll'> {
        const interval = customScrollThreshold ?? this._scrollSpeed.get();
        const throttledHandler = throttledScrollHandler(interval);

        const id = widget.connect('scroll-event', (self: GtkWidget, event: Gdk.Event) => {
            const scrollAction = this._getScrollAction(event, userDefinedActions);

            if (scrollAction) {
                throttledHandler(
                    this._sanitizeInput(scrollAction.cmd),
                    { clicked: self, event },
                    scrollAction.fn,
                    postInputUpdater,
                );
            }
        });

        return {
            disconnectScroll: () => widget.disconnect(id),
        };
    }

    /**
     * Determines which scroll configuration to use based on event
     */
    private _getScrollAction(
        event: Gdk.Event,
        userDefinedActions: InputHandlerEvents,
    ): InputHandlerEventArgs | undefined {
        if (isScrollUp(event)) {
            return userDefinedActions.onScrollUp;
        }

        if (isScrollDown(event)) {
            return userDefinedActions.onScrollDown;
        }
    }

    /**
     * Sets up reactive bindings that recreate handlers when dependencies change
     */
    private _setupBindings(
        widget: GtkWidget,
        userDefinedActions: InputHandlerEvents,
        handlers: UpdateHandlers,
        postInputUpdater?: Variable<boolean>,
        customScrollThreshold?: number,
    ): Variable<void> {
        const eventCommands = [
            userDefinedActions.onPrimaryClick?.cmd,
            userDefinedActions.onSecondaryClick?.cmd,
            userDefinedActions.onMiddleClick?.cmd,
            userDefinedActions.onScrollUp?.cmd,
            userDefinedActions.onScrollDown?.cmd,
        ];

        const eventCommandBindings = eventCommands.map((cmd) => this._sanitizeVariable(cmd));

        return Variable.derive([bind(this._scrollSpeed), ...eventCommandBindings], () => {
            this._disconnectHandlers(handlers);

            const newHandlers = this._createEventHandlers(
                widget,
                userDefinedActions,
                postInputUpdater,
                customScrollThreshold,
            );

            Object.assign(handlers, newHandlers);
        });
    }

    /**
     * Disconnects all event handlers
     */
    private _disconnectHandlers(handlers: UpdateHandlers): void {
        handlers.disconnectPrimary();
        handlers.disconnectSecondary();
        handlers.disconnectMiddle();
        handlers.disconnectScroll();
    }

    /**
     * Sanitizes a variable input to a string
     */
    private _sanitizeInput(input?: Variable<string> | undefined): string {
        if (!input) return '';

        return input.get();
    }

    /**
     * Sanitizes a variable for binding
     */
    private _sanitizeVariable(variable?: Variable<string> | undefined): Binding<string> {
        return bind(variable ?? this._EMPTY_CMD);
    }
}
