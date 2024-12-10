import AstalNetwork from 'gi://AstalNetwork?version=0.1';

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
};
