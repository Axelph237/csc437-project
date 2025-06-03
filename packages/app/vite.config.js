import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
    // Transforms all index.html files in codebase into equivalent rollup paths
    const indexFilePaths = findFilesByExtension(__dirname, "index.html", ["dist"]);

    let rollupInput = {  }
    for (const path of indexFilePaths) {
        const subPath = (path.split("app"))[1] // Get latter half of directory after proto/
        const subDir = subPath.slice(1, - ("/index.html".length)) // Remove /index.html from files

        rollupInput[subDir || "main"] = path;
    }

    return {
        build: {
            rollupOptions: {
                input: rollupInput
            },
        },
        server: {
            proxy: {
                "/api": "http://localhost:3000",
                "/auth": "http://localhost:3000",
                "/images": "http://localhost:3000",
                "/login": "http://localhost:3000",
                "/register": "http://localhost:3000"
            }
        }
    }
})

import fs from 'fs'
import path from 'path'

function findFilesByExtension(dir, extension, ignoredFiles = [], fileList = []) {
    const files = fs.readdirSync(dir, { withFileTypes: true })

    for (const file of files) {
        if (ignoredFiles.includes(file.name))
            continue;

        // Get full path of file
        const fullPath = path.join(dir, file.name)

        if (file.isDirectory()) {
            // Search through directory
            findFilesByExtension(fullPath, extension, ignoredFiles, fileList)
        } else if (file.isFile() && fullPath.endsWith(extension)) {
            // Add file to array
            fileList.push(fullPath)
        }
    }

    return fileList
}
