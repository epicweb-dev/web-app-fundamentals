import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'
import fsExtra from 'fs-extra'
import { $ } from 'execa'
import pMap from 'p-map'
import {
	getApps,
	isProblemApp,
} from '@kentcdodds/workshop-app/build/utils/apps.server.js'

// getApps expects this env var
process.env.NODE_ENV = 'development'

const allApps = await getApps()
const uniqueApps = allApps.filter(
	(a, index) => allApps.findIndex(b => b.fullPath === a.fullPath) === index,
)

console.log(
	'📝  copying .env.example to .env files and generating prisma client...',
)

const problemApps = allApps.filter(isProblemApp)

// we just grab the last problem app and set that one up because we're setup to
// have all the exercise apps share a single database and prisma has a
// postinstall that sets up the client in each individual app anyway.
const lastProblemApp = problemApps[problemApps.length - 1]
await pMap(
	uniqueApps,
	async app => {
		await fs.promises.copyFile(
			path.join(app.fullPath, '.env.example'),
			path.join(app.fullPath, '.env'),
		)

		if (app.fullPath === lastProblemApp.fullPath) {
			const { all, exitCode } = await $({
				cwd: lastProblemApp.fullPath,
				all: true,
			})`npm run setup --silent`
			if (exitCode === 0) {
				console.log(`✅  Setup complete for ${lastProblemApp.relativePath}`)
			} else {
				console.log(all)
				throw new Error(
					`❌  npm run setup for ${lastProblemApp.relativePath} app failed`,
				)
			}
		} else {
			const { all, exitCode } = await $({
				cwd: app.fullPath,
				all: true,
			})`npx prisma generate`

			if (exitCode === 0) {
				console.log(`✅  prisma client generated for ${app.relativePath}`)
			} else {
				console.log(all)
				throw new Error(`❌  prisma generate failed for ${app.relativePath}`)
			}
		}
	},
	{ concurrency: Math.ceil(os.cpus().length / 3) },
)
