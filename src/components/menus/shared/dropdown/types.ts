import { Astal, Gtk } from 'astal/gtk3';
import { Binding } from 'astal';
import { BarLocation } from 'src/lib/options/types';

export interface DropdownMenuProps {
    name: string;
    child?: JSX.Element | JSX.Element[] | Binding<JSX.Element | undefined>;
    layout?: string;
    transition?: Gtk.RevealerTransitionType | Binding<Gtk.RevealerTransitionType>;
    exclusivity?: Astal.Exclusivity;
    fixed?: boolean;
    onDestroy?: () => void;
}

export type LocationMap = {
    [key in BarLocation]: Astal.WindowAnchor;
};
