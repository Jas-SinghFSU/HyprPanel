import { Gtk } from 'astal/gtk3';
import { Exclusivity, GtkWidget, Transition } from './widget.types';
import { Binding } from 'astal';
import { WindowProps } from 'astal/gtk3/widget';

export type PopupWindowProps = {
    name: string;
    child?: JSX.Element | JSX.Element[];
    layout?: Layouts;
    transition?: Transition | Binding<Transition>;
    exclusivity?: Exclusivity;
} & WindowProps;

export type LayoutFunction = (
    name: string,
    child: Gtk.Widget,
    transition: Gtk.RevealerTransitionType,
) => {
    center: () => Gtk.Widget;
    top: () => Gtk.Widget;
    'top-right': () => Gtk.Widget;
    'top-center': () => Gtk.Widget;
    'top-left': () => Gtk.Widget;
    'bottom-left': () => Gtk.Widget;
    'bottom-center': () => Gtk.Widget;
    'bottom-right': () => Gtk.Widget;
};
export type Layouts =
    | 'center'
    | 'top'
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export type Opts = {
    className: string;
    vexpand: boolean;
};

export type PaddingProps = {
    name: string;
    opts?: Opts;
};

export type PopupRevealerProps = {
    name: string;
    child: GtkWidget;
    transition: Gtk.RevealerTransitionType;
};
