import { Attribute } from 'lib/types/widget';
import { MprisPlayer } from 'types/service/mpris';
import Slider from 'types/widgets/slider';

/**
 * Updates the tooltip text of the slider based on the player's current position.
 *
 * @param self - The slider component to update.
 * @param foundPlayer - The MPRIS player object, if available.
 */
export const updateTooltip = (self: Slider<Attribute>, foundPlayer?: MprisPlayer): void => {
    if (foundPlayer === undefined) {
        self.tooltip_text = '00:00';
        return;
    }

    const playerPosition = foundPlayer.position;

    const curHour = Math.floor(playerPosition / 3600);
    const curMin = Math.floor((playerPosition % 3600) / 60);
    const curSec = Math.floor(playerPosition % 60);

    if (typeof foundPlayer.position === 'number' && foundPlayer.position >= 0) {
        const formatTime = (time: number): string => {
            return time.toString().padStart(2, '0');
        };

        const formatHour = (hour: number): string => {
            return hour > 0 ? formatTime(hour) + ':' : '';
        };

        self.tooltip_text = `${formatHour(curHour)}${formatTime(curMin)}:${formatTime(curSec)}`;
    } else {
        self.tooltip_text = `00:00`;
    }
};

/**
 * Updates the value of the slider based on the player's current position and length.
 *
 * @param self - The slider component to update.
 * @param foundPlayer - The MPRIS player object, if available.
 */
export const update = (self: Slider<Attribute>, foundPlayer?: MprisPlayer): void => {
    if (foundPlayer !== undefined) {
        const value = foundPlayer.length ? foundPlayer.position / foundPlayer.length : 0;
        self.value = value > 0 ? value : 0;
    } else {
        self.value = 0;
    }
};
