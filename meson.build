project('hyprpanel')

bindir = get_option('prefix') / get_option('bindir')
datadir = get_option('prefix') / get_option('datadir') / 'hyprpanel'

ags = find_program('ags', required: true)
find_program('gjs', required: true)

src_file_list_process = run_command(
  'find',
  'src',
  '-type', 'f',
  '(',
  '-name', '*.ts',
  '-o',
  '-name', '*.tsx',
  '-o',
  '-name', '*.scss',
  ')',
)

if src_file_list_process.returncode() != 0
  error('Failed to find source files.')
endif

src_file_list = src_file_list_process.stdout().split('\n')

all_sources = []

foreach file : src_file_list
  file_stripped = file.strip()
  if file_stripped != ''
    all_sources += meson.project_source_root() / file_stripped
  endif
endforeach

custom_target(
  'hyprpanel_bundle',
  input: all_sources,
  command: [
    ags,
    'bundle',
    meson.project_source_root() / 'app.ts',
    '@OUTPUT@',
    '--src', meson.project_source_root(),
  ],
  output: 'hyprpanel.js',
  install: true,
  install_dir: datadir,
)

configure_file(
  input: 'scripts/hyprpanel_launcher.sh.in',
  output: 'hyprpanel',
  configuration: {'DATADIR': datadir},
  install: true,
  install_dir: bindir,
  install_mode: 'rwxr-xr-x',
)

install_subdir('scripts', install_dir: datadir)
install_subdir('themes', install_dir: datadir)
install_subdir('assets', install_dir: datadir)
install_subdir('src/scss', install_dir: datadir / 'src')
