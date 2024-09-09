import { WindowProps } from "types/widgets/window";

export type DropdownMenuProps = {
    name: string;
    child: any;
    layout?: string;
    transition?: any;
    exclusivity?: Exclusivity;
    fixed?: boolean;
} & WindowProps;
