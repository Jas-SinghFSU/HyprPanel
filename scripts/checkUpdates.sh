#!/bin/bash

check_flatpak_updates() {
  flatpak_updates=0
  if [[ -x "$(command -v flatpak)" ]]; then
    flatpak_updates=$(flatpak update | grep -E "^[[:blank:]][0-9]{1}\." | wc -l)
  fi
  echo $flatpak_updates
}

check_arch_updates() {
  official_updates=0
  aur_updates=0
  flatpak_updates=$(check_flatpak_updates)
  
	if command -v paru &> /dev/null; then
		aur_helper="paru"
	else
		aur_helper="yay"
	fi

  if [ "$1" = "-y" ]; then
    aur_updates=$($aur_helper -Qum 2>/dev/null | wc -l)
  elif [ "$1" = "-p" ]; then
    official_updates=$(checkupdates 2>/dev/null | wc -l)
  else
    official_updates=$(checkupdates 2>/dev/null | wc -l)
    aur_updates=$($aur_helper -Qum 2>/dev/null | wc -l)
  fi

  total_updates=$((official_updates + aur_updates + flatpak_updates))

  echo $total_updates
}

check_ubuntu_updates() {
  result=$(apt-get -s -o Debug::NoLocking=true upgrade | grep -c ^Inst)
  flatpak_updates=$(check_flatpak_updates)
  echo "$((result + flatpak_updates))"
}

check_fedora_updates() {
  result=$(dnf check-update -q | grep -v '^Loaded plugins' | grep -v '^No match for' | wc -l)
  flatpak_updates=$(check_flatpak_updates)
  echo "$((result + flatpak_updates))"
}

case "$1" in
-arch)
    check_arch_updates "$2"
    ;;
-ubuntu)
    check_ubuntu_updates
    ;;
-fedora)
    check_fedora_updates
    ;;
-flatpak)
    check_flatpak_updates
    ;;
*)
    echo "0"
    ;;
esac
