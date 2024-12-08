/**
 * Updates the tooltip text of the slider based on the player's current position.
 *
 * @param position - The current position of the player.
 * @param totalLength - The total length of the media.
 */
export const getTimeStamp = (position: number, totalLength: number): string => {
    if (typeof position === 'number' && position >= 0) {
        return `${getFormattedTime(position)} / ${getFormattedTime(totalLength)}`;
    } else {
        return `00:00`;
    }
};

export const getFormattedTime = (time: number): string => {
    const curHour = Math.floor(time / 3600);
    const curMin = Math.floor((time % 3600) / 60);
    const curSec = Math.floor(time % 60);

    const formatTime = (time: number): string => {
        return time.toString().padStart(2, '0');
    };

    const formatHour = (hour: number): string => {
        return hour > 0 ? formatTime(hour) + ':' : '';
    };

    return `${formatHour(curHour)}${formatTime(curMin)}:${formatTime(curSec)}`;
};
