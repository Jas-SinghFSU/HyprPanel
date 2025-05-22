import { opt } from 'src/lib/options';

export default {
    updateCommand: opt(`${SRC_DIR}/scripts/checkUpdates.sh -arch`),
    updateTooltipCommand: opt(`${SRC_DIR}/scripts/checkUpdates.sh -arch -tooltip`),
    extendedTooltip: opt(false),
    label: opt(true),
    padZero: opt(true),
    autoHide: opt(false),
    icon: {
        pending: opt('󰏗'),
        updated: opt('󰏖'),
    },
    pollingInterval: opt(1000 * 60 * 60 * 6),
    leftClick: opt(`$TERMINAL -e ${SRC_DIR}/scripts/runUpdates.sh -arch`),
    rightClick: opt(''),
    middleClick: opt(''),
    scrollUp: opt(''),
    scrollDown: opt(''),
};
