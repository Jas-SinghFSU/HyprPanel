import options from "options";

const { show_numbered, show_icons } = options.bar.workspaces;

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
