import options from "options";

const { showIcon, showTime } = options.bar.clock;

showIcon.connect("changed", () => {
    if (!showTime.value && !showIcon.value) {
        showTime.value = true;
    }
});

showTime.connect("changed", () => {
    if (!showTime.value && !showIcon.value) {
        showIcon.value = true;
    }
});
