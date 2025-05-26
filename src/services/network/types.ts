import AstalNetwork from 'gi://AstalNetwork?version=0.1';

export type WifiIcon = '󰤩' | '󰤨' | '󰤪' | '󰤨' | '󰤩' | '󰤮' | '󰤨' | '󰤥' | '󰤢' | '󰤟' | '󰤯' | '󰤫';

type DeviceSate = AstalNetwork.DeviceState;
type DevceStates = {
    [key in DeviceSate]: string;
};

export const DEVICE_STATES: DevceStates = {
    [AstalNetwork.DeviceState.UNKNOWN]: 'Unknown',
    [AstalNetwork.DeviceState.UNMANAGED]: 'Unmanaged',
    [AstalNetwork.DeviceState.UNAVAILABLE]: 'Unavailable',
    [AstalNetwork.DeviceState.DISCONNECTED]: 'Disconnected',
    [AstalNetwork.DeviceState.PREPARE]: 'Prepare',
    [AstalNetwork.DeviceState.CONFIG]: 'Config',
    [AstalNetwork.DeviceState.NEED_AUTH]: 'Need Authentication',
    [AstalNetwork.DeviceState.IP_CONFIG]: 'IP Configuration',
    [AstalNetwork.DeviceState.IP_CHECK]: 'IP Check',
    [AstalNetwork.DeviceState.SECONDARIES]: 'Secondaries',
    [AstalNetwork.DeviceState.ACTIVATED]: 'Activated',
    [AstalNetwork.DeviceState.DEACTIVATING]: 'Deactivating',
    [AstalNetwork.DeviceState.FAILED]: 'Failed',
} as const;

export const wifiIconMap = new Map<string, WifiIcon>([
    ['network-wireless-acquiring', '󰤩'],
    ['network-wireless-connected', '󰤨'],
    ['network-wireless-encrypted', '󰤪'],
    ['network-wireless-hotspot', '󰤨'],
    ['network-wireless-no-route', '󰤩'],
    ['network-wireless-offline', '󰤮'],
    ['network-wireless-signal-excellent', '󰤨'],
    ['network-wireless-signal-good', '󰤥'],
    ['network-wireless-signal-ok', '󰤢'],
    ['network-wireless-signal-weak', '󰤟'],
    ['network-wireless-signal-none', '󰤯'],
]);

export const AP_FLAGS = {
    NONE: 0,
    PRIVACY: 1,
} as const;
