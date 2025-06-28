final: prev: {
  hyprpanel = prev.hyprpanel.overrideAttrs {
    version = "0-unstable-dev";
    src = ./..;
  };
}
