#!/bin/bash

check_arch_updates() {
    result=$(yay -Qum --noconfirm 2>/dev/null | wc -l || echo 0)
    echo "$result"
}

check_ubuntu_updates() {
  result=$(apt-get -s -o Debug::NoLocking=true upgrade | grep -c ^Inst)
  echo "$result"
}

case "$1" in
-arch)
    check_arch_updates
    ;;
-ubuntu)
    check_ubuntu_updates
    ;;
*)
    echo "0"
    ;;
esac
