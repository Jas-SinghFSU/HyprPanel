import { BarLocation } from 'src/lib/types/options';

export type EventBoxPaddingProps = {
    className: string;
    windowName: string;
};

export type BarEventMarginsProps = {
    windowName: string;
    location?: BarLocation;
};
