import options from "options";
import { module } from "../../modules/bar/module"

const { label, labelType, round } = options.bar.customModules.ram;

export const Ram = () => {
    const divide = ([total, free]) => Math.round((free / total) * 100);

    const formatSizeInGB = (sizeInKB: number) => {
        const sizeInGB = (sizeInKB / 1024 ** 2).toFixed(1);
        return round.value ? Math.round(parseFloat(sizeInGB)) : sizeInGB;
    }

    const ramUsage = Variable(
        { total: 0, used: 0, percentage: 0 },
        {
            poll: [
                2000,
                "free",
                (out) => {
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
                        total: formatSizeInGB(totalRam),
                        used: formatSizeInGB(usedRam),
                    };
                },
            ],
        },
    );

    const ramModule = module({
        textIcon: "",
        label: Utils.merge([ramUsage.bind("value"), labelType.bind("value")], (rmUsg, lblType) => {
            if (lblType === "mem/total") {
                return `${rmUsg.used}/${rmUsg.total} GB`;
            }
            if (lblType === "memory") {
                return `${rmUsg.used} GB`;
            }
            return `${rmUsg.percentage}%`;
        }),
        tooltipText: "RAM",
        boxClass: "ram",
        showLabel: label.bind("value"),
    });

    return ramModule;
}
