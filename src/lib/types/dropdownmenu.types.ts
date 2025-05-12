import { Astal, Gtk } from 'astal/gtk3';
import { Binding } from 'astal';
import { WindowProps } from 'astal/gtk3/widget';

export interface DropdownMenuProps {
    name: string;
    child?: JSX.Element | JSX.Element[] | Binding<JSX.Element | undefined>;
    layout?: string;
    transition?: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>;
    exclusivity?: Astal.Exclusivity;
    fixed?: boolean;
    onDestroy?: () => void;
}
