import { json, redirect, type DataFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Spacer } from '~/components/spacer.tsx'
import { prisma } from '~/utils/db.server.ts'
import { Button } from '~/utils/forms.tsx'
import { getUserImgSrc, useOptionalUser } from '~/utils/misc.ts'

export async function loader({ params }: DataFunctionArgs) {
	invariant(params.username, 'Missing username')
	const user = await prisma.user.findUnique({
		where: { username: params.username },
		select: {
			id: true,
			username: true,
			name: true,
			imageId: true,
			createdAt: true,
			host: { select: { userId: true } },
			renter: { select: { userId: true } },
		},
	})
	if (!user) {
		throw new Response('not found', { status: 404 })
	}
	if (user.host) {
		throw redirect(`/users/${params.username}/host`)
	}
	if (user.renter) {
		throw redirect(`/users/${params.username}/renter`)
	}
	return json({ user, userJoinedDisplay: user.createdAt.toLocaleDateString() })
}

export default function UsernameIndex() {
	const data = useLoaderData<typeof loader>()
	const loggedInUser = useOptionalUser()
	const isLoggedInUser = data.user.id === loggedInUser?.id

	return (
		<div className="container mx-auto flex flex-col items-center justify-center">
			<img
				className="h-52 w-52 rounded-full object-cover"
				alt={data.user.name ?? data.user.username}
				src={getUserImgSrc(data.user.imageId)}
			/>
			<h1 className="text-h2">{data.user.name ?? data.user.username}</h1>
			<p className="text-night-200">Joined {data.userJoinedDisplay}</p>
			<Spacer size="4xs" />
			{isLoggedInUser ? (
				<>
					<Link
						to="/settings/profile"
						className="rounded-full border border-night-400 px-10 py-5"
					>
						✏️ Create your profile
					</Link>
					<Spacer size="4xs" />
					<Form action="/logout" method="post">
						<Button type="submit" size="pill" variant="secondary">
							Logout
						</Button>
					</Form>
				</>
			) : (
				<p className="text-body-2xs text-night-200">
					This user does not have a renter or host profile yet.
				</p>
			)}
		</div>
	)
}

// 🐨 add a meta export here that returns the title and description for this page
// Use the user's name (username fallback) for the title
// Say whatever you like for the description
