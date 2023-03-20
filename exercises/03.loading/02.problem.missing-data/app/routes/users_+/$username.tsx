import { json, type DataFunctionArgs } from '@remix-run/node'
import {
	Form,
	NavLink,
	Outlet,
	useLoaderData,
	useMatches,
} from '@remix-run/react'
import clsx from 'clsx'
import { getUserId } from '~/utils/auth.server'
import { prisma } from '~/utils/db.server'
import { Button } from '~/utils/forms'

export async function loader({ request, params }: DataFunctionArgs) {
	// 🐨 use invariant (from the 'tiny-invariant' package) to throw an error if
	// the username is missing from the params
	const loggedInUserId = await getUserId(request)
	const user = await prisma.user.findUnique({
		where: { username: params.username },
	})
	// 🐨 if the user does not exist, throw a 404 response
	// 🦉 we'll handle this error in a later exercise.

	return json({
		// 🐨 you can now remove the optional chain (the ? mark here) because the
		// user will always be defined now
		isSelf: user?.id === loggedInUserId,
	})
}

export default function UserRoute() {
	const data = useLoaderData<typeof loader>()
	const matches = useMatches()
	const lastMatch = matches[matches.length - 1]
	const onIndexPage = lastMatch.id.endsWith('index')

	return (
		<div className="mt-36 mb-48">
			{onIndexPage ? null : (
				<div className="container mx-auto flex justify-end">
					<div className="flex justify-between gap-6">
						{data.isSelf ? (
							<Form action="/logout" method="post">
								<Button type="submit" size="pill" variant="secondary">
									Logout
								</Button>
							</Form>
						) : null}
						<div className="flex justify-between rounded-full border border-night-400 bg-night-700">
							<NavLink
								preventScrollReset
								prefetch="intent"
								to="host"
								className={({ isActive }) =>
									clsx('rounded-full py-3 px-12 leading-3', {
										'bg-night-700 text-white': !isActive,
										'bg-white text-black': isActive,
									})
								}
							>
								Host
							</NavLink>
							<NavLink
								preventScrollReset
								prefetch="intent"
								to="renter"
								className={({ isActive }) =>
									clsx('rounded-full py-3 px-12 leading-3', {
										'bg-night-700 text-white': !isActive,
										' bg-white text-black': isActive,
									})
								}
							>
								Renter
							</NavLink>
						</div>
					</div>
				</div>
			)}
			<Outlet />
		</div>
	)
}
