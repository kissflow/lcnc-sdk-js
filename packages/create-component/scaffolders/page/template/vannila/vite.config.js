import { defineConfig } from 'vite'
import path from 'node:path'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    build: {
        target: 'es2022',
        outDir: 'dist',
        assetsDir: 'assets',
        copyPublicDir: true,
        minify: false,
        cssMinify: false,
    },
    plugins: [
        {
            name: 'emit-manifest-vite-plugin',
            writeBundle() {
                const manifestContent = {
                    Category: 'Page',
                    Framework: 'Vanilla',
                }
                const outputPath = resolve(__dirname, 'dist/manifest.json')
                writeFileSync(
                    outputPath,
                    JSON.stringify(manifestContent, null, 2)
                )
            },
        },
    ],
    server: {
        https: {
            cert: path.resolve('./cert/localhost.crt'),
            key: path.resolve('./cert/localhost.key'),
        },
        host: '0.0.0.0',
    },
})
