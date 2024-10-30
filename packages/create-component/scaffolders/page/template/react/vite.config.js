import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),

        {
            name: 'emit-manifest-vite-plugin',
            writeBundle() {
                const manifestContent = {
                    Category: 'Page',
                    Framework: 'React',
                }
                const outputPath = resolve(__dirname, 'dist/manifest.json')
                writeFileSync(
                    outputPath,
                    JSON.stringify(manifestContent, null, 2)
                )
            },
        },
    ],
    base: '',
    build: {
        target: 'es2022',
    },
    server: {
        https: {
            cert: path.resolve('./cert/localhost.crt'),
            key: path.resolve('./cert/localhost.key'),
        },
        host: '0.0.0.0',
    },
})
