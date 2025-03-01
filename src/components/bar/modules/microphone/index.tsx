import options from 'src/options';
import { Module } from '../../shared/Module';
import { bind, Variable } from 'astal';
import { BarBoxChild } from 'src/lib/types/bar';
import { Astal } from 'astal/gtk3';
import { inputHandler } from '../../utils/helpers';
import AstalWp from 'gi://AstalWp?version=0.1';

const wireplumber = AstalWp.get_default() as AstalWp.Wp;
const audioService = wireplumber.audio;

const { label, mutedIcon, unmutedIcon, leftClick, rightClick, middleClick, scrollUp, scrollDown } =
    options.bar.customModules.microphone;

export const Microphone = (): BarBoxChild => {
    const iconBinding = Variable.derive(
        [
            bind(mutedIcon),
            bind(unmutedIcon),
            bind(audioService.defaultMicrophone, 'volume'),
            bind(audioService.defaultMicrophone, 'mute'),
        ],
        (iconMuted, iconUnmuted, volume, isMuted) => {
            if (isMuted || volume === 0) {
                return iconMuted;
            }

            return iconUnmuted;
        },
    );

    const tooltipBinding = Variable.derive(
        [
            bind(mutedIcon),
            bind(unmutedIcon),
            bind(audioService.defaultMicrophone, 'description'),
            bind(audioService.defaultMicrophone, 'volume'),
            bind(audioService.defaultMicrophone, 'mute'),
        ],
        (iconMuted, iconUnmuted, description, volume, isMuted) => {
            const icon = isMuted || !volume ? iconMuted : iconUnmuted;

            return `${icon} ${description}`;
        },
    );
    const microphoneModule = Module({
        textIcon: iconBinding(),
        label: bind(audioService.defaultMicrophone, 'volume').as((vol) => `${Math.round(vol * 100)}%`),
        tooltipText: tooltipBinding(),
        boxClass: 'mic',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        cmd: scrollUp,
                    },
                    onScrollDown: {
                        cmd: scrollDown,
                    },
                });
            },
        },
    });

    return microphoneModule;
};
