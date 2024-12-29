import { monitorFile } from 'astal';
import { resetCss } from '../style';

export const initializeHotReload = async (): Promise<void> => {
    const monitorList = [
        `${SRC_DIR}/src/scss/main.scss`,
        `${SRC_DIR}/src/scss/style/bar`,
        `${SRC_DIR}/src/scss/style/common`,
        `${SRC_DIR}/src/scss/style/menus`,
        `${SRC_DIR}/src/scss/style/notifications`,
        `${SRC_DIR}/src/scss/style/osd`,
        `${SRC_DIR}/src/scss/style/settings`,
        `${SRC_DIR}/src/scss/style/colors.scss`,
        `${SRC_DIR}/src/scss/style/highlights.scss`,
    ];

    monitorList.forEach((file) => monitorFile(file, resetCss));
};
