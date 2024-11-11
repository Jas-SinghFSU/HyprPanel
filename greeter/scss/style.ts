import { bash, dependencies } from 'lib/utils';

const resetCss = async (): Promise<void> => {
    if (!dependencies('sass')) return;

    try {
        const css = `${App.configDir}/greeter/dist/main.css`;
        const localScss = `${App.configDir}/scss/main.scss`;

        await bash(`sass --load-path=${App.configDir}/scss/ ${localScss} ${css}`);

        App.applyCss(css, true);
    } catch (error) {
        console.error(error);
    }
};

Utils.monitorFile(`${App.configDir}/scss/style/`, resetCss);

await resetCss();
