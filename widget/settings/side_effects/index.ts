import options from "options";

const { show_numbered, show_icons } = options.bar.workspaces;
const { monochrome: monoBar } = options.theme.bar.buttons;
const { monochrome: monoMenu } = options.theme.bar.menus;
const { matugen } = options.theme;

show_numbered.connect("changed", ({ value }) => {
    if (value === true) {
        show_icons.value = false;
    }
})

show_icons.connect("changed", ({ value }) => {
    if (value === true) {
        show_numbered.value = false;
    }
})

matugen.connect("changed", ({ value }) => {
    if (value === true) {
        monoBar.value = false;
        monoMenu.value = false;
    }
})
