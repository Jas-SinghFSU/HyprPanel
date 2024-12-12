import { monitorFile } from 'astal';
import { resetCss } from '../style';

export const initializeHotReload = async (): Promise<void> => {
    const monitorList = [
        `${SRC}/src/scss/style/bar`,
        `${SRC}/src/scss/style/common`,
        `${SRC}/src/scss/style/menus`,
        `${SRC}/src/scss/style/notifications`,
        `${SRC}/src/scss/style/osd`,
        `${SRC}/src/scss/style/settings`,
        `${SRC}/src/scss/style/colors.scss`,
        `${SRC}/src/scss/style/highlights.scss`,
    ];

    monitorList.forEach((file) => monitorFile(file, resetCss));
};
