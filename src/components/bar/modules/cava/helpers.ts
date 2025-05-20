import { bind, Variable } from 'astal';
import AstalCava from 'gi://AstalCava?version=0.1';
import AstalMpris from 'gi://AstalMpris?version=0.1';
import options from 'src/configuration';

const {
    showActiveOnly,
    bars,
    autoSensitivity,
    lowCutoff,
    highCutoff,
    noiseReduction,
    stereo,
    channels,
    framerate,
    samplerate,
} = options.bar.customModules.cava;

/**
 * Initializes a visibility tracker that updates the visibility status based on the active state and the presence of players.
 *
 * @param isVis - A variable that holds the visibility status.
 */
export function initVisibilityTracker(isVis: Variable<boolean>): Variable<void> {
    const cavaService = AstalCava.get_default();
    const mprisService = AstalMpris.get_default();

    return Variable.derive([bind(showActiveOnly), bind(mprisService, 'players')], (showActive, players) => {
        isVis.set(cavaService !== null && (!showActive || players?.length > 0));
    });
}

/**
 * Initializes a settings tracker that updates the CAVA service settings based on the provided options.
 */
export function initSettingsTracker(): Variable<void> | undefined {
    const cava = AstalCava.get_default();

    if (!cava) {
        return;
    }

    return Variable.derive(
        [
            bind(bars),
            bind(channels),
            bind(framerate),
            bind(samplerate),
            bind(autoSensitivity),
            bind(lowCutoff),
            bind(highCutoff),
            bind(noiseReduction),
            bind(stereo),
        ],
        (bars, channels, framerate, samplerate, autoSens, lCutoff, hCutoff, noiseRed, isStereo) => {
            cava.set_autosens(autoSens);
            cava.set_low_cutoff(lCutoff);
            cava.set_high_cutoff(hCutoff);
            cava.set_noise_reduction(noiseRed);
            cava.set_source('auto');
            cava.set_stereo(isStereo);
            cava.set_bars(bars);
            cava.set_channels(channels);
            cava.set_framerate(framerate);
            cava.set_samplerate(samplerate);
        },
    );
}
