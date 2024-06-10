export const Power = () => {
  return {
    component: Widget.Box({
      child: Widget.Button({
        class_name: "bar-powermenu",
        child: Widget.Label({
          class_name: "bar-power_label",
          label: "⏻",
        }),
      }),
    }),
    isVisible: true,
    props: {
      on_clicked: () => App.toggleWindow("powermenu"),
    },
  };
};
