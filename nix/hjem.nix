{
  config,
  inputs,
  lib,
  username,
  ...
}:
{
  imports = [
    inputs.hjem.nixosModules.default
    (lib.modules.mkAliasOptionModule [ "hj" ] [ "hjem" "users" "${username}" ]) # Stolen from gitlab/fazzi
  ];
  hjem = {
    clobberByDefault = true;
    extraModules = [ inputs.hjem-rum.hjemModules.default ];

    users.${username} = {
      enable = true;
      user = "${username}";
      directory = "/home/antonio";
      environment = {
        sessionVariables =
          {
            NIXPKGS_ALLOW_UNFREE = "1";

          };
        };
    };
  };
}
