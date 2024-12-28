project(
  'hyprpanel',
  default_options: [
    'prefix=/usr',
  ],
)

prefix = get_option('prefix')
bindir = prefix / get_option('bindir')
datadir = prefix / get_option('datadir') / meson.project_name()

ags = find_program('ags', required: true)
find_program('gjs', required: true)

custom_target(
  'hyprpanel_bundle',
  input: files('app.ts'),
  command: [
    ags,
    'bundle',
    '--define', 'DATADIR="' + datadir + '"',
    '--root', meson.project_source_root(),
    meson.project_source_root() / 'app.ts',
    '@OUTPUT@',
  ],
  output: meson.project_name() + '.js',
  install: true,
  install_dir: datadir,
  build_always_stale: true,
)

configure_file(
  input: 'scripts/hyprpanel_launcher.sh.in',
  output: meson.project_name(),
  configuration: {'DATADIR': datadir},
  install: true,
  install_dir: bindir,
  install_mode: 'rwxr-xr-x',
)

install_subdir('scripts', install_dir: datadir)
install_subdir('themes', install_dir: datadir)
install_subdir('assets', install_dir: datadir)
install_subdir('src/scss', install_dir: datadir / 'src')
