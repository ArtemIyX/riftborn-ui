// vite.config.js
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'          // assuming this is what you meant by vueDevTools()
import Components from 'unplugin-vue-components/vite'     // ← this line is missing in your code

import {fileURLToPath, URL} from 'node:url'
import {viteSingleFile} from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteSingleFile(),

    // Add the auto-components plugin here
    Components({
      dirs: [
        'src/components/shared',          // scans this folder (and subfolders because deep: true)
        // You can add more folders if needed, e.g.
        // 'src/components/ui',
        // 'src/features/*/components',
      ],

      extensions: ['vue'],

      // Generates src/components.d.ts → TypeScript + Volar will see all components
      dts: 'src/components.d.ts',

      // Scans subdirectories recursively (very useful)
      deep: true,
    }),
  ],
  build: {
    outDir: 'C:/Users/Wellsaik/source/repos/Barich/Content/HTML',
    assetsDir: './assets',
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
