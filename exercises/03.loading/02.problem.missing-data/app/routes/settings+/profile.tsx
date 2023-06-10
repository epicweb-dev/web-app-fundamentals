import { json, type DataFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { requireUserId } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { getUserImgSrc } from '~/utils/misc.ts'

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			username: true,
			imageId: true,
		},
	})
	// 🦉 if the user is not found, then they are apparently logged in
	// (because requireUserId verified that), but there is no user account for
	// them. This could happen if their account got deleted.
	// 🐨 So let's log them out and redirect them home.
	// 💰 you can use the `authenticator.logout` from '~/utils/auth.server' to do this:
	// 💰 throw await authenticator.logout(request, { redirectTo: '/' })

	return json({ user })
}

export default function EditUserProfile() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="container m-auto mb-36 mt-16 max-w-3xl">
			<div className="flex gap-3">
				{/* 🦺 Huzzah! Listening to TypeScript is good for the soul */}
				{/* @ts-expect-error 💣 delete this comment now that you've fixed the loader */}
				<Link className="text-night-300" to={`/users/${data.user.username}`}>
					Profile
				</Link>
				<span className="text-night-300">▶️</span>
				<span>Edit Profile</span>
			</div>
			<div className="mt-16 flex flex-col gap-12">
				<div className="flex justify-center">
					<div className="relative h-52 w-52">
						<img
							// 🦺 Yippee!
							// @ts-expect-error 💣 delete this comment now that you've fixed the loader
							src={getUserImgSrc(data.user.imageId)}
							alt={data.user?.username}
							className="h-full w-full rounded-full object-cover"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
