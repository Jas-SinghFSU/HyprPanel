import { mprisService } from 'src/lib/constants/services';
import options from 'src/options';
import { getTimeStamp } from './helpers';
import { bind } from 'astal';
import { Widget } from 'astal/gtk3';

const { displayTimeTooltip } = options.menus.media;

export const MediaSlider = (): JSX.Element => {
    const sliderTooltip = bind(mprisService.players[0], 'position').as((position) => {
        if (mprisService.players[0].length > 0) {
            return getTimeStamp(position, mprisService.players[0].length);
        }
        return '00:00';
    });

    const sliderValue = bind(mprisService.players[0], 'position').as((position) => {
        if (mprisService.players[0].length > 0) {
            return position / mprisService.players[0].length;
        }
        return 0;
    });

    const dragHandler = ({ value }: Widget.Slider): void =>
        mprisService.players[0].set_position(value * mprisService.players[0].length);

    return (
        <box className={'media-indicator-current-progress-bar'} hexpand>
            <slider
                className={'menu-slider media progress'}
                hasTooltip={bind(displayTimeTooltip)}
                tooltipText={sliderTooltip}
                value={sliderValue}
                onDragged={dragHandler}
                drawValue={false}
                hexpand
            />
        </box>
    );
};
