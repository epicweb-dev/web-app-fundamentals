import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { createFixture } from './utils.ts'

const remix = process.env.REMIX_DEV_HTTP_ORIGIN as string

export const server = setupServer(
	rest.post(`${remix}/ping`, req => {
		return req.passthrough()
	}),
	rest.post(
		'https://api.mailgun.net/v3/:domain/messages',
		async (req, res, ctx) => {
			const body = Object.fromEntries(new URLSearchParams(await req.text()))
			console.info('🔶 mocked email contents:', body)

			const { to } = body
			if (typeof to === 'string') {
				await createFixture(to, body)
			}
			const randomId = '20210321210543.1.E01B8B612C44B41B'
			const id = `<${randomId}>@${req.params.domain}`
			return res(ctx.json({ id, message: 'Queued. Thank you.' }))
		},
	),
)

server.listen({ onUnhandledRequest: 'warn' })
console.info('🔶 Mock server installed')

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())
