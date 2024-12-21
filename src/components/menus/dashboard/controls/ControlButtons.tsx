import { bind } from 'astal';
import { networkService } from 'src/lib/constants/services';
import { bluetoothService } from 'src/lib/constants/services';
import { notifdService } from 'src/lib/constants/services';
import { audioService } from 'src/lib/constants/services';
import { isPrimaryClick } from 'src/lib/utils';
import { isWifiEnabled } from './helpers';

export const WifiButton = (): JSX.Element => {
    return (
        <button
            className={bind(isWifiEnabled).as((isEnabled) => `dashboard-button wifi ${!isEnabled ? 'disabled' : ''}`)}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    networkService.wifi?.set_enabled(!networkService.wifi.enabled);
                }
            }}
            tooltipText={'Toggle Wifi'}
            expand
        >
            <label className={'txt-icon'} label={bind(isWifiEnabled).as((isEnabled) => (isEnabled ? '󰤨' : '󰤭'))} />
        </button>
    );
};

export const BluetoothButton = (): JSX.Element => {
    return (
        <button
            className={bind(bluetoothService, 'isPowered').as(
                (isEnabled) => `dashboard-button bluetooth ${!isEnabled ? 'disabled' : ''}`,
            )}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    bluetoothService.toggle();
                }
            }}
            tooltipText={'Toggle Bluetooth'}
            expand
        >
            <label
                className={'txt-icon'}
                label={bind(bluetoothService, 'isPowered').as((isEnabled) => (isEnabled ? '󰂯' : '󰂲'))}
            />
        </button>
    );
};

export const NotificationsButton = (): JSX.Element => {
    return (
        <button
            className={bind(notifdService, 'dontDisturb').as(
                (dnd) => `dashboard-button notifications ${dnd ? 'disabled' : ''}`,
            )}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    notifdService.set_dont_disturb(!notifdService.dontDisturb);
                }
            }}
            tooltipText={'Toggle Notifications'}
            expand
        >
            <label className={'txt-icon'} label={bind(notifdService, 'dontDisturb').as((dnd) => (dnd ? '󰂛' : '󰂚'))} />
        </button>
    );
};

export const PlaybackButton = (): JSX.Element => {
    return (
        <button
            className={bind(audioService.defaultSpeaker, 'mute').as(
                (isMuted) => `dashboard-button playback ${isMuted ? 'disabled' : ''}`,
            )}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    audioService.defaultSpeaker.set_mute(!audioService.defaultSpeaker.mute);
                }
            }}
            tooltipText={'Toggle Mute (Playback)'}
            expand
        >
            <label
                className={'txt-icon'}
                label={bind(audioService.defaultSpeaker, 'mute').as((isMuted) => (isMuted ? '󰖁' : '󰕾'))}
            />
        </button>
    );
};

export const MicrophoneButton = (): JSX.Element => {
    return (
        <button
            className={bind(audioService.defaultMicrophone, 'mute').as(
                (isMuted) => `dashboard-button input ${isMuted ? 'disabled' : ''}`,
            )}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    audioService.defaultMicrophone.set_mute(!audioService.defaultMicrophone.mute);
                }
            }}
            tooltipText={'Toggle Mute (Microphone)'}
            expand
        >
            <label
                className={'txt-icon'}
                label={bind(audioService.defaultMicrophone, 'mute').as((isMuted) => (isMuted ? '󰍭' : '󰍬'))}
            />
        </button>
    );
};
