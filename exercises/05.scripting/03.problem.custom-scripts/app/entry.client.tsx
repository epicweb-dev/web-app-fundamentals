import { RemixBrowser } from '@remix-run/react'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

// 🐨 add an if statement here that checks if the ENV.NODE_ENV is development
// 🐨 if it is, then: import('./utils/devtools').then(({ init }) => init())
startTransition(() => {
	hydrateRoot(document, <RemixBrowser />)
})
