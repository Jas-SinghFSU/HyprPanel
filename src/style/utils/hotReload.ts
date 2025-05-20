import { monitorFile } from 'astal';
import { themeManager } from '..';

export const initializeHotReload = async (): Promise<void> => {
    const monitorList = [
        `${SRC_DIR}/src/style/main.scss`,
        `${SRC_DIR}/src/style/scss/bar`,
        `${SRC_DIR}/src/style/scss/common`,
        `${SRC_DIR}/src/style/scss/menus`,
        `${SRC_DIR}/src/style/scss/notifications`,
        `${SRC_DIR}/src/style/scss/osd`,
        `${SRC_DIR}/src/style/scss/settings`,
        `${SRC_DIR}/src/style/scss/colors.scss`,
        `${SRC_DIR}/src/style/scss/highlights.scss`,
        `${CONFIG_DIR}/modules.scss`,
    ];

    monitorList.forEach((file) => monitorFile(file, themeManager.applyCss.bind(themeManager)));
};
