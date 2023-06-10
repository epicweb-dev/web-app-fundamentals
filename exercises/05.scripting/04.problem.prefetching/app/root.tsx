import { KCDShopIFrameSync } from '@kentcdodds/workshop-app/iframe-sync'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cssBundleHref } from '@remix-run/css-bundle'
import {
	json,
	type DataFunctionArgs,
	type LinksFunction,
} from '@remix-run/node'
import {
	Form,
	Link,
	Links,
	LiveReload,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useSubmit,
} from '@remix-run/react'
import { useId, useState } from 'react'
import appStylesheetUrl from './styles/app.css'
import tailwindStylesheetUrl from './styles/tailwind.css'
import { authenticator } from './utils/auth.server.ts'
import { prisma } from './utils/db.server.ts'
import { getEnv } from './utils/env.server.ts'
import { ButtonLink } from './utils/forms.tsx'
import { getUserImgSrc, typedBoolean, useUser } from './utils/misc.ts'
import { generateStarsSvg } from './utils/starfield.server.ts'

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: '/fonts/nunito-sans/font.css' },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
		{ rel: 'stylesheet', href: appStylesheetUrl },
	].filter(typedBoolean)
}

export async function loader({ request }: DataFunctionArgs) {
	const userId = await authenticator.isAuthenticated(request)

	const user = userId
		? await prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, name: true, username: true, imageId: true },
		  })
		: null
	if (userId && !user) {
		console.info('something weird happened')
		// something weird happened... The user is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await authenticator.logout(request, { redirectTo: '/' })
	}

	return json({ user, ENV: getEnv() })
}

export default function App() {
	const data = useLoaderData<typeof loader>()
	const { user } = data
	return (
		<html lang="en" className="h-full">
			<head>
				<Links />
			</head>
			<body className="scrollbar-thin scrollbar-thumb-gray-300 flex h-full flex-col justify-between bg-night-700 text-white">
				<header className="container mx-auto py-6">
					<nav className="flex justify-between">
						<Link to="/">
							<div className="font-light">rocket</div>
							<div className="font-bold">Rental</div>
						</Link>
						<div className="flex items-center gap-10">
							<Link to="/search">🔍</Link>
							{user ? (
								<UserDropdown />
							) : (
								<ButtonLink to="/login" size="sm" variant="primary">
									Log In
								</ButtonLink>
							)}
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
				<ScrollRestoration />
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
					}}
				/>
				<Scripts />
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

function UserDropdown() {
	const user = useUser()
	const submit = useSubmit()
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<Link
					to={`/users/${user.username}`}
					// this is for progressive enhancement
					onClick={e => e.preventDefault()}
					className="flex items-center gap-2 rounded-full bg-night-500 py-2 pl-2 pr-4 outline-none hover:bg-night-400 focus:bg-night-400 radix-state-open:bg-night-400"
				>
					<img
						className="h-8 w-8 rounded-full object-cover"
						alt={user.name ?? user.username}
						src={getUserImgSrc(user.imageId)}
					/>
					<span className="text-body-sm font-bold">
						{user.name ?? user.username}
					</span>
				</Link>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					sideOffset={8}
					align="start"
					className="flex flex-col rounded-3xl bg-[#323232]"
				>
					<DropdownMenu.Item asChild>
						<Link
							// 🐨 add prefetch here
							to={`/users/${user.username}`}
							className="rounded-t-3xl px-7 py-5 outline-none hover:bg-night-500 radix-highlighted:bg-night-500"
						>
							👤 Profile
						</Link>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Link
							// 🐨 add prefetch here
							to="/favorites"
							className="px-7 py-5 outline-none hover:bg-night-500 radix-highlighted:bg-night-500"
						>
							🔖 Favorites
						</Link>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Link
							// 🐨 add prefetch here
							to="/bookings"
							className="px-7 py-5 outline-none hover:bg-night-500 radix-highlighted:bg-night-500"
						>
							🚀 Bookings
						</Link>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Form
							action="/logout"
							method="post"
							className="rounded-b-3xl px-7 py-5 outline-none radix-highlighted:bg-night-500"
							onClick={e => submit(e.currentTarget)}
						>
							<button type="submit">🚪 Logout</button>
						</Form>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}
