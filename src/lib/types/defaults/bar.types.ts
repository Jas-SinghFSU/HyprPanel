import { Astal } from 'astal/gtk3';
import { NetstatLabelType, ResourceLabelType } from '../bar.types';
import { BarLocation } from '../../options/options.types';

export const LABEL_TYPES: ResourceLabelType[] = ['used/total', 'used', 'free', 'percentage'];

export const NETWORK_LABEL_TYPES: NetstatLabelType[] = ['full', 'in', 'out'];

type LocationMap = {
    [key in BarLocation]: Astal.WindowAnchor;
};
export const locationMap: LocationMap = {
    top: Astal.WindowAnchor.TOP,
    bottom: Astal.WindowAnchor.BOTTOM,
};
