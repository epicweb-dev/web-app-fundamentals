import fsExtra from 'fs-extra'
import path from 'path'
import glob from 'glob'

const here = (...s: Array<string>) => path.join(__dirname, ...s)

const allFiles = glob.sync(here('../server/**/*.*').replace(/\\/g, '/'), {
	ignore: ['**/tsconfig.json', '**/eslint*', '**/__tests__/**'],
})

const entries = []
for (const file of allFiles) {
	if (/\.(ts|js|tsx|jsx)$/.test(file)) {
		entries.push(file)
	} else {
		const dest = file.replace(here('../server'), here('../server-build'))
		fsExtra.ensureDir(path.parse(dest).dir)
		fsExtra.copySync(file, dest)
		console.log(`copied: ${file.replace(`${here('../server')}/`, '')}`)
	}
}

console.log()
console.log('building...')

require('esbuild')
	.build({
		entryPoints: glob.sync(
			here('../server/**/*.+(ts|js|tsx|jsx)').replace(/\\/g, '/'),
		),
		outdir: here('../server-build'),
		target: [`node18`],
		platform: 'node',
		format: 'cjs',
		logLevel: 'info',
	})
	.catch((error: unknown) => {
		console.error(error)
		process.exit(1)
	})
