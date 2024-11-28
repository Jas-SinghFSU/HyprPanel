import { audio } from 'src/lib/constants/services.js';
import { openMenu } from '../../utils/menu.js';
import options from 'src/options';
import { runAsyncCommand, throttledScrollHandler } from 'src/components/bar/utils/helpers.js';
import { GtkWidget } from 'src/lib/types/widget.js';
import Variable from 'astal/variable.js';
import { bind } from 'astal/binding.js';
import { useHook } from 'src/lib/shared/hookHandler.js';
import { onMiddleClick, onPrimaryClick, onScroll, onSecondaryClick } from 'src/lib/shared/eventHandlers.js';
import { getIcon } from './helpers.js';

const { rightClick, middleClick, scrollUp, scrollDown } = options.bar.volume;

const Volume = (): GtkWidget => {
    const volumeIcon = (isMuted: boolean, vol: number): GtkWidget => {
        return <label className={'bar-button-icon volume txt-icon bar'} label={getIcon(isMuted, vol)} />;
    };

    const volumeLabel = (vol: number): GtkWidget => {
        return <label className={'bar-button-label volume'} label={`${Math.round(vol * 100)}%`} />;
    };

    const componentTooltip = Variable.derive(
        [
            bind(audio.defaultSpeaker, 'description'),
            bind(audio.defaultSpeaker, 'volume'),
            bind(audio.defaultSpeaker, 'mute'),
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
        [bind(options.bar.volume.label), bind(audio.defaultSpeaker, 'volume'), bind(audio.defaultSpeaker, 'mute')],
        (showLabel, vol, isMuted) => {
            if (showLabel) {
                return [volumeIcon(isMuted, vol), volumeLabel(vol)];
            }
            return [volumeIcon(isMuted, vol)];
        },
    );
    const component = (
        <box vexpand={true} tooltipText={componentTooltip()} className={componentClassName()}>
            {componentChildren()}
        </box>
    );

    return {
        component,
        isVisible: true,
        boxClass: 'volume',
        props: {
            setup: (self: GtkWidget): void => {
                useHook(self, options.bar.scrollSpeed, () => {
                    const throttledHandler = throttledScrollHandler(options.bar.scrollSpeed.value);

                    const disconnectPrimary = onPrimaryClick(self, (clicked, event) => {
                        openMenu(clicked, event, 'audiomenu');
                    });

                    const disconnectSecondary = onSecondaryClick(self, (clicked, event) => {
                        runAsyncCommand(rightClick.value, { clicked, event });
                    });

                    const disconnectMiddle = onMiddleClick(self, (clicked, event) => {
                        runAsyncCommand(middleClick.value, { clicked, event });
                    });

                    const disconnectScroll = onScroll(self, throttledHandler, scrollUp.value, scrollDown.value);
                    return (): void => {
                        disconnectPrimary();
                        disconnectSecondary();
                        disconnectMiddle();
                        disconnectScroll();
                    };
                });
            },
        },
    };
};

export { Volume };
