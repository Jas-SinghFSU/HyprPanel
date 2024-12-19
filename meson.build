project('hyprpanel')

bindir = get_option('prefix') / get_option('bindir')
datadir = get_option('prefix') / get_option('datadir') / 'hyprpanel'

ags = find_program('ags', required: true)
find_program('gjs', required: true)

ts_file_list_process = run_command('find', 'src', '-type', 'f', '-name', '*.ts')

if ts_file_list_process.returncode() != 0
  error('Failed to list TypeScript files using find command')
endif

ts_file_list = ts_file_list_process.stdout().split('\n')

ts_sources = []
foreach file : ts_file_list
  file_stripped = file.strip()
  if file_stripped != ''
    ts_sources += meson.project_source_root() / file_stripped
  endif
endforeach

custom_target(
  'hyprpanel_bundle',
  input: ts_sources,
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
