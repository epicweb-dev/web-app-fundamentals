import { KCDShopIFrameSync } from '@kentcdodds/workshop-app/iframe-sync'
// 🐨 bring in the { cssBundleHref } from @remix-run/css-bundle
import { type LinksFunction } from '@remix-run/node'
import { Link, Links, LiveReload, Outlet } from '@remix-run/react'
import { useId, useState } from 'react'
import appStylesheetUrl from './styles/app.css'
import tailwindStylesheetUrl from './styles/tailwind.css'
import { ButtonLink } from './utils/forms'
import { generateStarsSvg } from './utils/starfield.server'

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: '/fonts/nunito-sans/font.css' },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
		{ rel: 'stylesheet', href: appStylesheetUrl },
		// 🐨 Add a link to cssBundleHref here
		// 🦺 cssBundleHref could possibly be undefined, so you'll want to handle that
	]
	// 💰 I used .filter on the array to remove undefined values, but TypeScript
	// isn't satisfied with that, so checkout the typedBoolean utility in ./utils/misc.ts
}

export default function App() {
	return (
		<html lang="en" className="h-full">
			<head>
				<Links />
			</head>
			<body className="flex h-full flex-col justify-between bg-night-700 text-white">
				<header className="container mx-auto py-6">
					<nav className="flex justify-between">
						<Link to="/">
							<div className="font-light">rocket</div>
							<div className="font-bold">Rental</div>
						</Link>
						<div className="flex items-center gap-10">
							<Link to="/search">🔍</Link>
							<ButtonLink to="/login" size="sm" variant="primary">
								Log In
							</ButtonLink>
						</div>
					</nav>
				</header>

				<div className="flex-1">
					<Outlet />
				</div>

				<div className="container mx-auto">
					<Link to="/">
						<div className="font-light">rocket</div>
						<div className="font-bold">Rental</div>
					</Link>
				</div>
				<div className="h-5" />
				<LiveReload />
				<KCDShopIFrameSync />
				<NoHydrate className="fixed inset-0 -z-10" getHTML={generateStarsSvg} />
			</body>
		</html>
	)
}

function NoHydrate({
	getHTML,
	...rest
}: { getHTML?: () => string } & JSX.IntrinsicElements['div']) {
	const id = useId()
	const [html] = useState(() => {
		if (typeof document === 'undefined') return getHTML?.() ?? ''
		const el = document.getElementById(id)
		if (!el) return getHTML?.() ?? ''
		return el.innerHTML
	})
	return <div {...rest} id={id} dangerouslySetInnerHTML={{ __html: html }} />
}
