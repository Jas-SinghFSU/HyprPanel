#!/bin/bash

# Provided by: https://github.com/JJDizz1L

install_arch_updates() {
    echo "Updating Arch Linux system..."
    sudo pacman -Syu
    echo "Updating AUR packages..."
    paru -Syu
    echo "Updating Flatpak packages..."
    flatpak update -y
    echo "Done with Arch & AUR updates."
}

install_ubuntu_updates() {
    echo "Updating Ubuntu system..."
    sudo apt update && sudo apt upgrade -y
    echo "Updating Flatpak packages..."
    flatpak update -y
    echo "Done with Ubuntu updates."
}

install_fedora_updates() {
    echo "Updating Fedora system..."
    sudo dnf update -y
    echo "Updating Flatpak packages..."
    flatpak update -y
    echo "Done with Fedora updates."
}

install_flatpak_updates() {
    echo "Updating Flatpak packages..."
    flatpak update -y
    echo "Done with FlatPak updates."
}

case "$1" in
-arch)
    install_arch_updates
    ;;
-ubuntu)
    install_ubuntu_updates
    ;;
-fedora)
    install_fedora_updates
    ;;
-flatpak)
    install_flatpak_updates
    ;;
*)
    echo "Usage: $0 {-arch|-ubuntu|-fedora|-flatpak}"
    ;;
esac

echo "Press any key to exit..."
read -n 1
