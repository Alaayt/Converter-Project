import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Converter-Project/",
  build: {
    sourcemap: false,  // يمنع Vite من استخدام eval في source maps
  },
});
