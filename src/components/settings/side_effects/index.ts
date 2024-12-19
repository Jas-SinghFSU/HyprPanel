import { Opt } from 'src/lib/option';
import options from 'src/options';

const { show_numbered, show_icons, showWsIcons, showApplicationIcons } = options.bar.workspaces;
const { monochrome: monoBar } = options.theme.bar.buttons;
const { monochrome: monoMenu } = options.theme.bar.menus;
const { matugen } = options.theme;

/**
 * Turns off the specified option variables when the source value is true.
 *
 * @param sourceValue - The source option whose value determines whether to turn off other options.
 * @param optionsToDisable - An array of option variables to disable if the source value is true.
 * @param ignoreVars - An optional array of option variables to ignore and not disable.
 */
const turnOffOptionVars = (
    sourceValue: Opt<boolean>,
    optionsToDisable: Array<Opt<boolean>>,
    ignoreVars?: Array<Opt<boolean>>,
): void => {
    const toggleOffVars = (varsToToggle: Array<Opt<boolean>>): void => {
        const varsToNotToggle = ignoreVars?.map((curVar) => curVar.id) || [];

        varsToToggle.forEach((curVar) => {
            if (sourceValue.id !== curVar.id && !varsToNotToggle.includes(curVar.id)) {
                curVar.set(false);
            }
        });
    };

    if (sourceValue.get()) {
        const varsToToggleOff = optionsToDisable;
        toggleOffVars(varsToToggleOff);
    }
};

/* ================================================== */
/*               WORKSPACE SIDE EFFECTS               */
/* ================================================== */
const workspaceOptsToDisable = [show_numbered, show_icons, showWsIcons, showApplicationIcons];

show_numbered.subscribe(() => {
    turnOffOptionVars(show_numbered, workspaceOptsToDisable);
});

show_icons.subscribe(() => {
    turnOffOptionVars(show_icons, workspaceOptsToDisable);
});

showWsIcons.subscribe(() => {
    turnOffOptionVars(showWsIcons, workspaceOptsToDisable, [showApplicationIcons]);
});

showApplicationIcons.subscribe(() => {
    turnOffOptionVars(showApplicationIcons, workspaceOptsToDisable, [showWsIcons]);

    if (showApplicationIcons.get()) {
        showWsIcons.set(true);
    }
});

/* ================================================== */
/*                MATUGEN SIDE EFFECTS                */
/* ================================================== */

matugen.subscribe(() => {
    if (matugen.get() === true) {
        monoBar.set(false);
        monoMenu.set(false);
    }
});
