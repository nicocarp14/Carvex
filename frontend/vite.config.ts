import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En Windows, archivos de public/ abiertos en otro programa (ej. una imagen
    // en el visor) bloquean el watcher y tumban Vite con EBUSY.
    // public/ se sirve estático, no necesita hot reload.
    watch: {
      ignored: ["**/public/**"],
    },
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
