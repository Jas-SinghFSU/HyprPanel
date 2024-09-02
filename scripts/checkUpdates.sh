#!/bin/bash

check_arch_updates() {
    result=$(yay -Qum --noconfirm 2>/dev/null | wc -l || echo 0)
    echo "$result"
}

check_flatpak_updates() {
    result=$(flatpak update --appstream --assumeyes 2>/dev/null | grep -c '^$' || echo 0)
    echo "$result"
}

check_snap_updates() {
    result=$(snap refresh --list 2>/dev/null | grep -cv '^No updates available.' || echo 0)
    echo "$result"
}

check_ubuntu_updates() {
    result=$(apt list --upgradable 2>/dev/null | grep -cv '^Listing' || echo 0)
    echo "$result"
}

check_nixos_updates() {
    result=$(nix-channel --list 2>/dev/null | grep -c '.' || echo 0)
    echo "$result"
}

check_fedora_updates() {
    result=$(dnf check-update 2>/dev/null | grep -cv '^Last metadata expiration check' || echo 0)
    echo "$result"
}

case "$1" in
-arch)
    check_arch_updates
    ;;
-flatpak)
    check_flatpak_updates
    ;;
-snap)
    check_snap_updates
    ;;
-ubuntu)
    check_ubuntu_updates
    ;;
-nixos)
    check_nixos_updates
    ;;
-fedora)
    check_fedora_updates
    ;;
*)
    echo "0"
    ;;
esac
