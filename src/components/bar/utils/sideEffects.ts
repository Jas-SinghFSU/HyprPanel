import options from '../../../options';

const { showIcon, showTime } = options.bar.clock;

showIcon.subscribe(() => {
    if (!showTime.value && !showIcon.value) {
        showTime.value = true;
    }
});

showTime.subscribe(() => {
    if (!showTime.value && !showIcon.value) {
        showIcon.value = true;
    }
});

const { label, icon } = options.bar.windowtitle;

label.subscribe(() => {
    if (!label.value && !icon.value) {
        icon.value = true;
    }
});

icon.subscribe(() => {
    if (!label.value && !icon.value) {
        label.value = true;
    }
});
