import options from "options";
import { module } from "../../modules/bar/module"

const { label } = options.bar.ram;

export const Ram = () => {
    const divide = ([total, free]) => free / total;

    const formatSizeInGB = (sizeInKB: number) =>
        Number((sizeInKB / 1024 ** 2).toFixed(2));

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
        label: ramUsage.bind("value").as(v => {
            return `${v.used}GB`;
        }),
        tooltipText: "RAM",
        boxClass: "ram",
        showLabel: label.bind("value"),
    });

    return ramModule;
}
