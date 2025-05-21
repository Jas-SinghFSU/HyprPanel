import options from 'src/configuration';

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
