import { audioService } from 'src/lib/constants/services.js';
import { openMenu } from '../../utils/menu.js';
import options from 'src/options';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { bind, Variable } from 'astal';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import { getIcon } from './helpers/index.js';
import { BarBoxChild } from 'src/lib/types/bar.js';
import { Astal } from 'astal/gtk3';

const { rightClick, middleClick, scrollUp, scrollDown } = options.bar.volume;

const Volume = (): BarBoxChild => {
    const VolumeIcon = ({ isMuted, volume }: VolumeIconProps): JSX.Element => {
        return <label className={'bar-button-icon volume txt-icon bar'} label={getIcon(isMuted, volume)} />;
    };

    const VolumeLabel = ({ volume }: VolumeLabelProps): JSX.Element => {
        return <label className={'bar-button-label volume'} label={`${Math.round(volume * 100)}%`} />;
    };

    const componentTooltip = Variable.derive(
        [
            bind(audioService.defaultSpeaker, 'description'),
            bind(audioService.defaultSpeaker, 'volume'),
            bind(audioService.defaultSpeaker, 'mute'),
        ],
        (desc, vol, isMuted) => {
            return `${getIcon(isMuted, vol)} ${desc}`;
        },
    );
    const componentClassName = Variable.derive(
        [options.theme.bar.buttons.style, options.bar.volume.label],
        (style, showLabel) => {
            const styleMap = {
                default: 'style1',
                split: 'style2',
                wave: 'style3',
                wave2: 'style3',
            };
            return `volume-container ${styleMap[style]} ${!showLabel ? 'no-label' : ''}`;
        },
    );
    const componentChildren = Variable.derive(
        [
            bind(options.bar.volume.label),
            bind(audioService.defaultSpeaker, 'volume'),
            bind(audioService.defaultSpeaker, 'mute'),
        ],
        (showLabel, vol, isMuted) => {
            if (showLabel) {
                return (
                    <box>
                        <VolumeIcon isMuted={isMuted} volume={vol} />
                        <VolumeLabel volume={vol} />
                    </box>
                );
            }

            return <VolumeIcon isMuted={isMuted} volume={vol} />;
        },
    );
    const component = (
        <box
            vexpand
            tooltipText={componentTooltip()}
            className={componentClassName()}
            onDestroy={() => {
                componentTooltip.drop();
                componentClassName.drop();
                componentChildren.drop();
            }}
        >
            {componentChildren()}
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'volume',
        props: {
            setup: (self: Astal.Button): void => {
                let disconnectFunctions: (() => void)[] = [];

                Variable.derive(
                    [
                        bind(rightClick),
                        bind(middleClick),
                        bind(scrollUp),
                        bind(scrollDown),
                        bind(options.bar.scrollSpeed),
                    ],
                    () => {
                        disconnectFunctions.forEach((disconnect) => disconnect());
                        disconnectFunctions = [];

                        const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.get());

                        disconnectFunctions.push(
                            onPrimaryClick(self, (clicked, event) => {
                                openMenu(clicked, event, 'audiomenu');
                            }),
                        );

                        disconnectFunctions.push(
                            onSecondaryClick(self, (clicked, event) => {
                                runAsyncCommand(rightClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(
                            onMiddleClick(self, (clicked, event) => {
                                runAsyncCommand(middleClick.get(), { clicked, event });
                            }),
                        );

                        disconnectFunctions.push(onScroll(self, throttledHandler, scrollUp.get(), scrollDown.get()));
                    },
                );
            },
        },
    };
};

interface VolumeIconProps {
    isMuted: boolean;
    volume: number;
}

interface VolumeLabelProps {
    volume: number;
}

export { Volume };
