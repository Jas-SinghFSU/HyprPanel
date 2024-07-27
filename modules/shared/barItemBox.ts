export const BarItemBox = (child) => {
  const computeVisible = () => {
    if (Object.hasOwnProperty.call(child, "isVis")) {
      return child.isVis.bind("value");
    }
    return child.isVisible;
  };

  return Widget.Button({
    class_name: `bar_item_box_visible ${Object.hasOwnProperty.call(child, "boxClass") ? child.boxClass : ""}`,
    child: child.component,
    visible: computeVisible(),
    ...child.props,
  });
};
