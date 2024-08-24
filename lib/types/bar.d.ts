import { Variable } from "types/variable";

export type Child = {
    component: Box<Gtk.Widget, unknown>;
    isVisible?: boolean;
    isVis?: Variable<boolean>;
    boxClass: string;
    props: ButtonProps;
};
