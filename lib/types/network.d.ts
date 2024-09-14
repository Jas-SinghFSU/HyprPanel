import { WIFI_STATUS_MAP } from 'globals/network';

export type AccessPoint = {
    bssid: string | null;
    address: string | null;
    lastSeen: number;
    ssid: string | null;
    active: boolean;
    strength: number;
    frequency: number;
    iconName: string | undefined;
};

export type WifiStatus = keyof typeof WIFI_STATUS_MAP;

export type WifiIcon = '󰤩' | '󰤨' | '󰤪' | '󰤨' | '󰤩' | '󰤮' | '󰤨' | '󰤥' | '󰤢' | '󰤟' | '󰤯';
