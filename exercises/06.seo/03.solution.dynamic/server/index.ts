import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import { createRequestHandler } from '@remix-run/express'
import { type ServerBuild } from '@remix-run/node'

const BUILD_DIR = path.join(process.cwd(), 'build')

const app = express()

app.use(compression())

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by')

// Remix fingerprints its assets so we can cache forever.
app.use(
	'/build',
	express.static('public/build', { immutable: true, maxAge: '1y' }),
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(
	express.static('public', {
		maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0,
	}),
)

app.use(morgan('tiny'))

app.all(
	'*',
	process.env.NODE_ENV === 'development'
		? async (req, res, next) => {
				purgeRequireCache()

				try {
					const build = await getBuild()

					return createRequestHandler({
						build,
						mode: process.env.NODE_ENV,
					})(req, res, next)
				} catch (error: unknown) {
					const message =
						error && typeof error === 'object' && 'message' in error
							? error.message
							: String(error)
					return res.status(500).send(message)
				}
		  }
		: createRequestHandler({
				build: require(BUILD_DIR),
				mode: process.env.NODE_ENV,
		  }),
)
const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`Express server listening on port ${port}`)
})

function purgeRequireCache() {
	// purge require cache on requests for "server side HMR" this won't let
	// you have in-memory objects between requests in development,
	// alternatively you can set up nodemon/pm2-dev to restart the server on
	// file changes, but then you'll have to reconnect to databases/etc on each
	// change. We prefer the DX of this, so we've included it for you by default
	for (const key in require.cache) {
		if (key.startsWith(BUILD_DIR)) {
			delete require.cache[key]
		}
	}
}

// wait for the build directory to exist before trying to require it
// this is necessary because the build directory is created by the
// build process, which is started by the dev process
async function getBuild(): Promise<ServerBuild> {
	let start = Date.now()
	while (Date.now() - start < 10000) {
		try {
			return require(BUILD_DIR)
		} catch (error: unknown) {
			if (
				error &&
				typeof error === 'object' &&
				'code' in error &&
				error.code !== 'MODULE_NOT_FOUND'
			) {
				throw error
			}
		}
		await new Promise(resolve => setTimeout(resolve, 100))
	}
	throw new Error(`Could not find build directory at ${BUILD_DIR}`)
}
