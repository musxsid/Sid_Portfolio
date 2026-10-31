import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// Custom plugin to guarantee any resume file placed in frontend/resume or public/resume is served dynamically
function resumeStaticPlugin() {
  return {
    name: 'serve-resume-folder',
    configureServer(server) {
      server.middlewares.use('/resume', (req, res, next) => {
        const reqPath = decodeURIComponent(req.url.replace(/^\//, ''));
        const resumeDirs = [
          path.resolve(__dirname, '../backend/resume'),
          path.resolve(__dirname, '../backend/src/main/resources/static/resume'),
          path.resolve(__dirname, 'resume'),
          path.resolve(__dirname, 'public/resume')
        ];

        let targetFile = null;

        if (reqPath) {
          for (const dir of resumeDirs) {
            const candidate = path.join(dir, reqPath);
            if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
              targetFile = candidate;
              break;
            }
          }
        }

        // If no direct match or requested root /resume, serve latest PDF in any folder
        if (!targetFile) {
          const findLatestPdf = (dir) => {
            if (!fs.existsSync(dir)) return null;
            const files = fs.readdirSync(dir)
              .filter(f => f.toLowerCase().endsWith('.pdf'))
              .map(f => ({ name: f, fullPath: path.join(dir, f), mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
              .sort((a, b) => b.mtime - a.mtime);
            return files.length > 0 ? files[0].fullPath : null;
          };

          for (const dir of resumeDirs) {
            targetFile = findLatestPdf(dir);
            if (targetFile) break;
          }
        }

        if (targetFile && fs.existsSync(targetFile)) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
          fs.createReadStream(targetFile).pipe(res);
          return;
        }

        next();
      });
    },
    // Also copy files from frontend/resume to dist/resume during build
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'resume');
      const distDir = path.resolve(__dirname, 'dist/resume');
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
        }
      }
    }
  };
}

// Serves any project screenshot or asset directly from backend storage folders dynamically
function backendProjectsStaticPlugin() {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
  };

  const projectDirs = [
    path.resolve(__dirname, '../backend/src/main/resources/static/projects'),
    path.resolve(__dirname, '../backend/projects'),
    path.resolve(__dirname, 'public/projects')
  ];

  return {
    name: 'serve-backend-projects-folder',
    configureServer(server) {
      server.middlewares.use('/projects', (req, res, next) => {
        const reqPath = decodeURIComponent(req.url.replace(/^\//, ''));
        if (!reqPath) return next();

        for (const dir of projectDirs) {
          const target = path.join(dir, reqPath);
          if (fs.existsSync(target) && fs.statSync(target).isFile()) {
            const ext = path.extname(target).toLowerCase();
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            fs.createReadStream(target).pipe(res);
            return;
          }
        }
        next();
      });
    },
    closeBundle() {
      // Mirror backend project images to dist/projects for static production bundle
      const distDir = path.resolve(__dirname, 'dist/projects');
      for (const dir of projectDirs) {
        if (!fs.existsSync(dir)) continue;
        const copyDirRecursive = (src, dest) => {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
          const entries = fs.readdirSync(src, { withFileTypes: true });
          for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
              copyDirRecursive(srcPath, destPath);
            } else {
              fs.copyFileSync(srcPath, destPath);
            }
          }
        };
        copyDirRecursive(dir, distDir);
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), resumeStaticPlugin(), backendProjectsStaticPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})
