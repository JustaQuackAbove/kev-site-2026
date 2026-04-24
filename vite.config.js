import { resolve } from 'node:path'
import { defineConfig } from 'vite'

function injectPageStyles() {
  return {
    name: 'inject-page-styles',
    transformIndexHtml: {
      order: 'pre',
      handler(_, ctx) {
        const currentPage = ctx.path.split('/').pop() || 'index.html'
        const tags = [
          {
            tag: 'link',
            attrs: { rel: 'stylesheet', href: '/src/style.css' },
            injectTo: 'head',
          },
          {
            tag: 'link',
            attrs: { rel: 'stylesheet', href: '/src/components/navbar.css' },
            injectTo: 'head',
          },
        ]

        if (currentPage === 'scene.html') {
          tags.push({
            tag: 'link',
            attrs: { rel: 'stylesheet', href: '/src/scroll-scenes/scrollScene.css' },
            injectTo: 'head',
          })
        }

        return { tags }
      },
    },
  }
}

export default defineConfig({
  plugins: [injectPageStyles()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        click: resolve(__dirname, 'click.html'),
        scroll: resolve(__dirname, 'scroll.html'),
        combo: resolve(__dirname, 'combo.html'),
        scene: resolve(__dirname, 'scene.html'),
      },
    },
  },
})
