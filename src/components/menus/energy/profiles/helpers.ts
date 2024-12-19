/**
 * Renders the uptime in a human-readable format.
 *
 * This function takes the current uptime in minutes and converts it to a string format showing days, hours, and minutes.
 *
 * @param curUptime The current uptime in minutes.
 *
 * @returns A string representing the uptime in days, hours, and minutes.
 */
export const renderUptime = (curUptime: number): string => {
    const days = Math.floor(curUptime / (60 * 24));
    const hours = Math.floor((curUptime % (60 * 24)) / 60);
    const minutes = Math.floor(curUptime % 60);
    return ` : ${days}d ${hours}h ${minutes}m`;
};
