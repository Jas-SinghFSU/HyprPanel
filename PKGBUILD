# Big thanks to kotontrio for providing this. You can find it in his repo as well
# as: https://github.com/kotontrion/PKGBUILDS/blob/main/agsv1/PKGBUILD
#
# Maintainer: kotontrion <kotontrion@tutanota.de>

# This package is only intended to be used while migrating from ags v1.8.2 to ags v2.0.0.
# Many ags configs are quite big and it takes a while to migrate, therefore I made this package
# to install ags v1.8.2 as "agsv1", so both versions can be installed at the same time, making it
# possible to migrate bit by bit while still having a working v1 config around.
#
# First update the aylurs-gtk-shell package to v2, then install this one.
#
# This package won't receive any updates anymore, so as soon as you migrated, uninstall this one.

pkgname=agsv1
_pkgname=ags
pkgver=1.8.2
pkgrel=1
pkgdesc="Aylurs's Gtk Shell (AGS), An eww inspired gtk widget system."
arch=('x86_64')
url="https://github.com/Aylur/ags"
license=('GPL-3.0-only')
makedepends=('gobject-introspection' 'meson' 'glib2-devel' 'npm' 'typescript')
depends=('gjs' 'glib2' 'glibc' 'gtk3' 'gtk-layer-shell' 'libpulse' 'pam')
optdepends=('gnome-bluetooth-3.0: required for bluetooth service'
    'greetd: required for greetd service'
    'libdbusmenu-gtk3: required for systemtray service'
    'libsoup3: required for the Utils.fetch feature'
    'libnotify: required for sending notifications'
    'networkmanager: required for network service'
    'power-profiles-daemon: required for powerprofiles service'
    'upower: required for battery service')
backup=('etc/pam.d/ags')
source=("$pkgname-$pkgver.tar.gz::https://github.com/Aylur/ags/releases/download/v${pkgver}/ags-v${pkgver}.tar.gz")
sha256sums=('ea0a706bef99578b30d40a2d0474b7a251364bfcf3a18cdc9b1adbc04af54773')

build() {
    cd $srcdir/$_pkgname
    npm install
    arch-meson build --libdir "lib/$_pkgname" -Dbuild_types=true
    meson compile -C build
}

package() {
    cd $srcdir/$_pkgname
    meson install -C build --destdir "$pkgdir"
    rm ${pkgdir}/usr/bin/ags
    ln -sf /usr/share/com.github.Aylur.ags/com.github.Aylur.ags ${pkgdir}/usr/bin/agsv1
}
