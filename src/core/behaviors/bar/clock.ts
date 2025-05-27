import options from 'src/configuration';

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
