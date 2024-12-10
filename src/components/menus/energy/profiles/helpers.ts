export const renderUptime = (curUptime: number): string => {
    const days = Math.floor(curUptime / (60 * 24));
    const hours = Math.floor((curUptime % (60 * 24)) / 60);
    const minutes = Math.floor(curUptime % 60);
    return ` : ${days}d ${hours}h ${minutes}m`;
};
