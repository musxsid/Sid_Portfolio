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
        const resumeDir = path.resolve(__dirname, 'resume');
        const publicResumeDir = path.resolve(__dirname, 'public/resume');

        let targetFile = null;

        if (reqPath) {
          const directFile1 = path.join(resumeDir, reqPath);
          const directFile2 = path.join(publicResumeDir, reqPath);
          if (fs.existsSync(directFile1) && fs.statSync(directFile1).isFile()) {
            targetFile = directFile1;
          } else if (fs.existsSync(directFile2) && fs.statSync(directFile2).isFile()) {
            targetFile = directFile2;
          }
        }

        // If no direct match or requested root /resume, serve latest PDF in either folder
        if (!targetFile) {
          const findLatestPdf = (dir) => {
            if (!fs.existsSync(dir)) return null;
            const files = fs.readdirSync(dir)
              .filter(f => f.toLowerCase().endsWith('.pdf'))
              .map(f => ({ name: f, fullPath: path.join(dir, f), mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
              .sort((a, b) => b.mtime - a.mtime);
            return files.length > 0 ? files[0].fullPath : null;
          };

          targetFile = findLatestPdf(resumeDir) || findLatestPdf(publicResumeDir);
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), resumeStaticPlugin()],
  server: {
    port: 5173,
    strictPort: true
  }
})
