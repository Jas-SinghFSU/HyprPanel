import { Opt } from "lib/option";

export type Unit = "imperial" | "metric";
export type PowerOptions = "sleep" | "reboot" | "logout" | "shutdown";
export type NotificationAnchor = "top" | "top right" | "top left" | "bottom" | "bottom right" | "bottom left";
export type RowProps<T> = {
    opt: Opt<T>
    title: string
    note?: string
    type?:
    | "number"
    | "color"
    | "float"
    | "object"
    | "string"
    | "enum"
    | "boolean"
    | "img"
    | "font"
    enums?: string[]
    max?: number
    min?: number
    subtitle?: string
}
