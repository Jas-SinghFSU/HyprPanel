import { Variable as VariableType } from "types/variable";

const divide = ([total, free]) => Math.round((free / total) * 100);

const formatSizeInGB = (sizeInKB: number, round: VariableType<boolean>) => {
    const sizeInGB = (sizeInKB / 1024 ** 2).toFixed(1);
    return round.value ? Math.round(parseFloat(sizeInGB)) : parseFloat(sizeInGB);
}

export const calculateRamUsage = (out: string, round: VariableType<boolean>) => {
    if (typeof out !== "string") {
        return { total: 0, used: 0, percentage: 0 };
    }

    const match = out.match(/Mem:\s+(\d+)\s+(\d+)/);

    if (!match) {
        return { total: 0, used: 0, percentage: 0 };
    }

    const totalRam = parseInt(match[1], 10);
    const usedRam = parseInt(match[2], 10);

    return {
        percentage: divide([totalRam, usedRam]),
        total: formatSizeInGB(totalRam, round),
        used: formatSizeInGB(usedRam, round),
    };
};

