import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@/lib': resolve('src/main/lib'),
        '@/classes': resolve('src/main/classes'),
        '@shared': resolve('src/shared'),
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },
  renderer: {
    assetsInclude: ['src/renderer/public/**/*'],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@/hooks': resolve('src/renderer/src/hooks'),
        '@/assets': resolve('src/renderer/src/assets'),
        '@/pages': resolve('src/renderer/src/pages'),
        '@/components': resolve('src/renderer/src/components'),
        '@/utils': resolve('src/renderer/src/utils')
      }
    },
    plugins: [react()]
  }
})
