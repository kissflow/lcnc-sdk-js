import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import archiver from 'archiver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const distPath = path.resolve(__dirname, '../dist')

const data = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
const { name: packageName } = JSON.parse(data)
const zipFilePath = path.resolve(__dirname, `../${packageName}.zip`)

if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath)
}

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true })
}

function buildProject() {
    execSync('npm run build', { stdio: 'inherit' }) // using 'npm' instead of other package managers, because npm is a safe bet
    // and will exists on everyone's machine if they have node.js installed.
}

async function zipDistFolder() {
    const output = fs.createWriteStream(zipFilePath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {})

    archive.on('error', (err) => {
        throw err
    })

    archive.pipe(output)
    archive.directory(distPath, false)
    await archive.finalize()
}

buildProject()
await zipDistFolder()

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true })
}
