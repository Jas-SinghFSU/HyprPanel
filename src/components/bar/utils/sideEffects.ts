import options from '../../../options';

const { showIcon, showTime } = options.bar.clock;

showIcon.subscribe(() => {
    if (!showTime.get() && !showIcon.get()) {
        showTime.set(true);
    }
});

showTime.subscribe(() => {
    if (!showTime.get() && !showIcon.get()) {
        showIcon.set(true);
    }
});

const { label, icon } = options.bar.windowtitle;

label.subscribe(() => {
    if (!label.get() && !icon.get()) {
        icon.set(true);
    }
});

icon.subscribe(() => {
    if (!label.get() && !icon.get()) {
        label.set(true);
    }
});
