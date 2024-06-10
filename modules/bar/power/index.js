export const Power = () => {
  return {
    component: Widget.Box({
      child: Widget.Button({
        class_name: "powermenu",
        on_clicked: () => App.toggleWindow("powermenu"),
        child: Widget.Label({
          class_name: "bar-power_label",
          label: "⏻",
        }),
      }),
    }),
    isVisible: true,
  };
};
