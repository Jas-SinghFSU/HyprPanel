import { Variable } from 'astal';
import { Gdk } from 'astal/gtk3';
import { Opt } from 'src/lib/options';
import { GtkWidget } from '../../types';

export type EventArgs = {
    clicked: GtkWidget;
    event: Gdk.Event;
};

export type UpdateHandlers = {
    disconnectPrimary: () => void;
    disconnectSecondary: () => void;
    disconnectMiddle: () => void;
    disconnectScroll: () => void;
};

export type InputHandlerEventArgs = {
    cmd?: Opt<string> | Variable<string>;
    fn?: (output: string) => void;
};
export type InputHandlerEvents = {
    onPrimaryClick?: InputHandlerEventArgs;
    onSecondaryClick?: InputHandlerEventArgs;
    onMiddleClick?: InputHandlerEventArgs;
    onScrollUp?: InputHandlerEventArgs;
    onScrollDown?: InputHandlerEventArgs;
};
