export const BarItemBox = (child) => {
  const computeVisible = () => {
    if (Object.hasOwnProperty.call(child, "isVis")) {
      return child.isVis.bind("value");
    }

    return child.isVisible;
  }

  return Widget.Box({
    class_name: "bar_item_box_visible",
    child: child.component,
    visible: computeVisible()
  });
};
