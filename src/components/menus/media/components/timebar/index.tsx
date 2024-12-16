import options from 'src/options';
import { bind, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import { activePlayer, currentPosition, timeStamp } from 'src/globals/media';

const { displayTimeTooltip } = options.menus.media;

export const MediaSlider = (): JSX.Element => {
    const sliderValue = Variable.derive([bind(activePlayer), bind(currentPosition)], (player, position) => {
        if (player === undefined) {
            return 0;
        }

        if (player.length > 0) {
            return position / player.length;
        }
        return 0;
    });

    const dragHandler = ({ value }: Widget.Slider): void => {
        const currentPlayer = activePlayer.get();

        if (currentPlayer !== undefined) {
            currentPlayer.set_position(value * currentPlayer.length);
        }
    };

    return (
        <box
            className={'media-indicator-current-progress-bar'}
            hexpand
            onDestroy={() => {
                sliderValue.drop();
            }}
        >
            <slider
                className={'menu-slider media progress'}
                hasTooltip={bind(displayTimeTooltip)}
                tooltipText={bind(timeStamp)}
                value={sliderValue()}
                onDragged={dragHandler}
                drawValue={false}
                hexpand
            />
        </box>
    );
};
