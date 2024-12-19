/**
 * Updates the tooltip text of the slider based on the player's current position.
 *
 * This function generates a formatted timestamp string that shows the current position and total length of the media.
 * If the position is invalid, it returns a default timestamp of "00:00".
 *
 * @param position The current position of the player in seconds.
 * @param totalLength The total length of the media in seconds.
 *
 * @returns A formatted timestamp string showing the current position and total length.
 */
export const getTimeStamp = (position: number, totalLength: number): string => {
    if (typeof position === 'number' && position >= 0) {
        return `${getFormattedTime(position)} / ${getFormattedTime(totalLength)}`;
    } else {
        return `00:00`;
    }
};

/**
 * Formats a given time in seconds into a human-readable string.
 *
 * This function converts a time value in seconds into a formatted string in the format "HH:MM:SS" or "MM:SS".
 * It handles hours, minutes, and seconds, and ensures that each component is zero-padded to two digits.
 *
 * @param time The time value in seconds to format.
 *
 * @returns A formatted time string in the format "HH:MM:SS" or "MM:SS".
 */
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
