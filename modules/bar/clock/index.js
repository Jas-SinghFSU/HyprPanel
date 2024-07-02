import { closeAllMenus } from "../index.js";

const date = Variable("", {
  poll: [1000, 'date "+󰃭  %a %b %d    %I:%M:%S %p"'],
});

const Clock = () => {
  return {
    component: Widget.Label({
      class_name: "clock",
      label: date.bind(),
    }),
    isVisible: true,
    props: {
      on_primary_click: () => {
        closeAllMenus();
        App.toggleWindow("calendarmenu");
      },
    },
  };
};

export { Clock };
