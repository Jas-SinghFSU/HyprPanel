import { Binding } from 'astal';
import { Gtk, Astal } from 'astal/gtk3';
import { WindowProps } from 'astal/gtk3/widget';

export type Layouts =
    | 'center'
    | 'top'
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export interface PopupWindowProps extends WindowProps {
    name: string;
    child?: JSX.Element;
    layout?: Layouts;
    transition?: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>;
    exclusivity?: Astal.Exclusivity;
}

export type LayoutFunction = (
    name: string,
    child: JSX.Element,
    transition: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>,
) => {
    center: () => JSX.Element;
    top: () => JSX.Element;
    'top-right': () => JSX.Element;
    'top-center': () => JSX.Element;
    'top-left': () => JSX.Element;
    'bottom-left': () => JSX.Element;
    'bottom-center': () => JSX.Element;
    'bottom-right': () => JSX.Element;
};

type Opts = {
    className: string;
    vexpand: boolean;
};

export type PaddingProps = {
    name: string;
    opts?: Opts;
};

export type PopupRevealerProps = {
    name: string;
    child: JSX.Element;
    transition: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>;
};
