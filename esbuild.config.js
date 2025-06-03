import esbuild from 'esbuild';
import { promises as fs } from 'fs';
import path from 'path';

const isDevelopment = process.argv.includes('-dev') || process.argv.includes('--dev') || process.argv.includes('-d');
const isWatch = process.argv.includes('-watch') || process.argv.includes('--watch') || process.argv.includes('-w');
console.log(`🚀 Building in ${isDevelopment ? 'development' : 'production'} mode`);

const outdir = isDevelopment ? './dist' : '/usr';
const hyprpanelDir = path.join(outdir, 'share/hyprpanel');

const entryPoints = ['app.ts'];
const staticDirs = ['scripts', 'themes', 'assets', 'src/style'];

const copyStaticFiles = {
  name: 'copy-static',
  setup(build) {
    build.onEnd(async () => {
      try {
        console.log('📁 Copying static files...');
        // Create output directory if it doesn't exist
        await fs.mkdir(outdir, { recursive: true });
        await copyDirs(staticDirs);
        await copyLauncherScript();
      } catch (error) {
        console.error('❌ Error copying static files:', error.message);
      }
    });
  }
};

const buildOptions = {
  entryPoints,
  entryNames: 'hyprpanel',
  outdir: hyprpanelDir,
  bundle: true,
  format: 'esm',
  platform: 'node',
  external: [
    'gi://*',
    'system',
  ],
  plugins: [copyStaticFiles], // Plugin to copy static files
  tsconfig: './tsconfig.json', // Use tsconfig for type checking and other settings
  keepNames: true, // Keep function names for better debugging
  sourcemap: false, // Generate sourcemaps in development mode
  minify: true, // Minify in production mode
  treeShaking: true,
  metafile: isDevelopment, // Generate metafile only in development mode
  splitting: false, // Disable code splitting for simplicity
  logLevel: 'info',
  color: true, // Enable colored output
  write: true, // Write output to disk
  define: {
    'DATADIR': JSON.stringify(hyprpanelDir)
  },
  resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  }
};

async function copyLauncherScript() {
  const sourceFile = 'scripts/hyprpanel_launcher.sh.in';
  const destDir = path.join(outdir, 'bin');
  const destFile = path.join(destDir, 'hyprpanel');

  try {
    // Check if source file exists
    await fs.access(sourceFile);
    // Read the template file
    const templateContent = await fs.readFile(sourceFile, 'utf8');
    // Replace @DATADIR@ with the actual data directory path
    const processedContent = templateContent.replace(/@DATADIR@/g, hyprpanelDir);
    // Create destination directory if it doesn't exist
    await fs.mkdir(destDir, { recursive: true });
    // Write the processed file
    await fs.writeFile(destFile, processedContent, { mode: 0o755 }); // Make it executable
    console.log(`✅ Launcher script copied to ${hyprpanelDir}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠️  Launcher script not found, skipping...');
    } else {
      console.error('❌ Error copying launcher script:', error.message);
    }
  }
}

// Plugin for copying static files
async function copyDirs(dirs) {
  const copyPromises = dirs.map(async (dir) => {
    try {
      await fs.access(dir);
      const destDir = path.join(outdir, '/share/hyprpanel', dir);

      const needsCopy = await shouldCopyDirectory(dir, destDir);

      if (needsCopy) {
        await fs.mkdir(path.dirname(destDir), { recursive: true });
        await fs.cp(dir, destDir, {
          recursive: true,
          force: true,
          preserveTimestamps: true // Preserve timestamps for future incremental builds
        });
        console.log(`✅ ${dir} copied`);
      } else {
        console.log(`⏭️  ${dir} skipped (no changes)`);
      }

      return { dir, success: true, copied: needsCopy };
    } catch (err) {
      console.log('⚠️ No scripts directory found');
      return { dir, success: false, error: err.message };
    }
  })
  const results = await Promise.all(copyPromises);
  return results;
};

// Function to check if a directory needs to be copied
async function shouldCopyDirectory(sourceDir, destDir) {
  try {
    const [sourceStat, destStat] = await Promise.all([
      fs.stat(sourceDir),
      fs.stat(destDir).catch(() => null)
    ]);

    // If destination does not exist, we need to copy
    if (!destStat) return true;

    // If source is newer than destination, we need to copy
    return sourceStat.mtime > destStat.mtime;
  } catch {
    // If we can't access the source directory, assume we need to copy
    return true;
  }
};

// Main build function
async function build() {
  try {
    await esbuild.build(buildOptions);
    console.log(`✅ Build completed successfully!`);
    console.log(`📦 Output directory: ${outdir}`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
};

// Función para watch mode
async function watch() {
  try {
    console.log('👀 Starting watch mode...');
    const ctx = await esbuild.context({
      ...buildOptions,
      plugins: [
        copyStaticFiles,
      ]
    });

    await ctx.watch();
    console.log('👀 Watching for changes... (Press Ctrl+C to stop)');

    // Mantener el proceso vivo
    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping watch mode...');
      await ctx.dispose();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Watch mode failed:', error);
    process.exit(1);
  }
}

if (isWatch) {
  watch();
} else {
  build();
}
