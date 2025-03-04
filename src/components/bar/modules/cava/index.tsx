import { Variable, bind } from 'astal';
import { Astal } from 'astal/gtk3';
import { BarBoxChild } from 'src/lib/types/bar';
import { Module } from '../../shared/Module';
import { inputHandler } from '../../utils/helpers';
import options from 'src/options';
import { initSettingsTracker, initVisibilityTracker } from './helpers';
import AstalCava from 'gi://AstalCava?version=0.1';
import { generateMediaLabel } from '../media/helpers';
import { activePlayer, mediaAlbum, mediaArtist, mediaTitle } from 'src/globals/media.js';

const {
    showIcon,
    showActiveOnly,
    barCharacters,
    spaceCharacter,
    leftClick,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
    truncation,
    truncation_size,
    show_tooltip,
    format,
} = options.bar.customModules.cava;

const isVis = Variable(!showActiveOnly.get());

export const Cava = (): BarBoxChild => {
    let labelBinding: Variable<string> = Variable('');
    const songIcon = Variable('');

    const visTracker = initVisibilityTracker(isVis);
    const settingsTracker = initSettingsTracker();
    const cavaService = AstalCava.get_default();

    if (cavaService) labelBinding = Variable.derive(
        [bind(cavaService, 'values'), bind(spaceCharacter), bind(barCharacters)],
        (values, spacing, blockCharacters) =>
            values.map((v: number) => {
                const index = Math.floor(v * blockCharacters.length);
                return blockCharacters[Math.min(index, blockCharacters.length - 1)];
            }).join(spacing),
    );

    const mediaLabel = Variable.derive(
        [
            bind(activePlayer),
            bind(truncation),
            bind(truncation_size),
            bind(show_tooltip),
            bind(format),
            bind(mediaTitle),
            bind(mediaAlbum),
            bind(mediaArtist),
        ],
        () => generateMediaLabel(truncation_size, show_tooltip, format, songIcon, activePlayer),
    );

    return Module({
        isVis,
        label: labelBinding(),
        showIconBinding: bind(showIcon),
        textIcon: bind(songIcon),
        boxClass: 'cava',
        tooltipText: mediaLabel(),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: { cmd: leftClick },
                    onSecondaryClick: { cmd: rightClick },
                    onMiddleClick: { cmd: middleClick },
                    onScrollUp: { cmd: scrollUp },
                    onScrollDown: { cmd: scrollDown },
                });
            },
            onDestroy: () => {
                labelBinding.drop();
                visTracker.drop();
                settingsTracker?.drop();
                songIcon.drop();
                mediaLabel.drop();
            },
        },
    });
};
