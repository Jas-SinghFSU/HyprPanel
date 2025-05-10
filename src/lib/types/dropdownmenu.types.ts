import { Astal, Gtk } from 'astal/gtk3';
import { Binding } from 'astal';
import { WindowProps } from 'astal/gtk3/widget';

export interface DropdownMenuProps extends WindowProps {
    name: string;
    child?: JSX.Element | JSX.Element[];
    layout?: string;
    transition?: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>;
    exclusivity?: Astal.Exclusivity;
    fixed?: boolean;
}
