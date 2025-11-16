import AstalNetwork from 'gi://AstalNetwork?version=0.1';
import NM from 'gi://NM?version=1.0';

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
    ['network-wireless-acquiring-symbolic', '󰤩'],
    ['network-wireless-connected', '󰤨'],
    ['network-wireless-connected-symbolic', '󰤨'],
    ['network-wireless-encrypted', '󰤪'],
    ['network-wireless-encrypted-symbolic', '󰤪'],
    ['network-wireless-hotspot', '󰤨'],
    ['network-wireless-hotspot-symbolic', '󰤨'],
    ['network-wireless-no-route', '󰤩'],
    ['network-wireless-no-route-symbolic', '󰤩'],
    ['network-wireless-offline', '󰤮'],
    ['network-wireless-offline-symbolic', '󰤮'],
    ['network-wireless-signal-excellent', '󰤨'],
    ['network-wireless-signal-excellent-symbolic', '󰤨'],
    ['network-wireless-signal-good', '󰤥'],
    ['network-wireless-signal-good-symbolic', '󰤥'],
    ['network-wireless-signal-ok', '󰤢'],
    ['network-wireless-signal-ok-symbolic', '󰤢'],
    ['network-wireless-signal-weak', '󰤟'],
    ['network-wireless-signal-weak-symbolic', '󰤟'],
    ['network-wireless-signal-none', '󰤯'],
    ['network-wireless-signal-none-symbolic', '󰤯'],
]);

export const AP_FLAGS = {
    NONE: 0,
    PRIVACY: 1,
} as const;

export const AP_SEC_FLAGS = {
    NONE: 0x0000,
    PAIR_WEP40: 0x0001,
    PAIR_WEP104: 0x0002,
    PAIR_TKIP: 0x0004,
    PAIR_CCMP: 0x0008,
    GROUP_WEP40: 0x0010,
    GROUP_WEP104: 0x0020,
    GROUP_TKIP: 0x0040,
    GROUP_CCMP: 0x0080,
    KEY_MGMT_PSK: 0x0100,
    KEY_MGMT_802_1X: 0x0200,
    KEY_MGMT_SAE: 0x0400,
    KEY_MGMT_OWE: 0x0800,
    KEY_MGMT_OWE_TM: 0x1000,
} as const;

export enum SecurityType {
    OPEN = 'open',
    OWE = 'owe',
    WEP = 'wep',
    WPA_PSK = 'wpa-psk',
    WPA_ENTERPRISE = 'wpa-eap',
    WPA3_SAE = 'sae',
}

/**
 * Error type classification for WiFi connection failures.
 */
export const enum ErrorType {
    AUTHENTICATION = 'AUTHENTICATION',
    TIMEOUT = 'TIMEOUT',
    DEVICE = 'DEVICE',
    OTHER = 'OTHER',
}

/**
 * NetworkManager active connection state reasons that indicate authentication failures.
 */
export const AUTH_STATE_REASONS: NM.ActiveConnectionStateReason[] = [
    NM.ActiveConnectionStateReason.NO_SECRETS,
    NM.ActiveConnectionStateReason.LOGIN_FAILED,
];

/**
 * NetworkManager device state reasons that indicate authentication failures.
 */
export const AUTH_DEVICE_REASONS: NM.DeviceStateReason[] = [
    NM.DeviceStateReason.NO_SECRETS,
    NM.DeviceStateReason.SUPPLICANT_DISCONNECT,
    NM.DeviceStateReason.SUPPLICANT_CONFIG_FAILED,
    NM.DeviceStateReason.SUPPLICANT_FAILED,
    NM.DeviceStateReason.SUPPLICANT_TIMEOUT,
    NM.DeviceStateReason.SSID_NOT_FOUND, // Often indicates auth failure when AP rejects connection
];

/**
 * NetworkManager device-related connection state reasons.
 */
export const DEVICE_STATE_REASONS: NM.ActiveConnectionStateReason[] = [
    NM.ActiveConnectionStateReason.DEVICE_DISCONNECTED,
    NM.ActiveConnectionStateReason.DEVICE_REALIZE_FAILED,
    NM.ActiveConnectionStateReason.DEVICE_REMOVED,
];

/**
 * User-friendly error messages for NetworkManager state reasons.
 */
export const CONNECTION_ERROR_MESSAGES: Record<number, string> = {
    [NM.ActiveConnectionStateReason.SERVICE_STOPPED]: 'Network service stopped.',
    [NM.ActiveConnectionStateReason.IP_CONFIG_INVALID]: 'Invalid IP configuration.',
    [NM.ActiveConnectionStateReason.SERVICE_START_TIMEOUT]: 'Service failed to start.',
    [NM.ActiveConnectionStateReason.SERVICE_START_FAILED]: 'Service failed to start.',
    [NM.ActiveConnectionStateReason.CONNECTION_REMOVED]: 'Connection profile removed.',
    [NM.ActiveConnectionStateReason.DEPENDENCY_FAILED]: 'Dependency failed.',
} as const;
