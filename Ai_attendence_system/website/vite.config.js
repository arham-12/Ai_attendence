import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(process.env.HOME, 'certs/key.pem')),
      cert: fs.readFileSync(path.resolve(process.env.HOME, 'certs/cert.pem')),
    },
    host: true,
  },
});
