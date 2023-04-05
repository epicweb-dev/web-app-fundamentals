import { json, type DataFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { authenticator, requireUserId } from '~/utils/auth.server'
import { prisma } from '~/utils/db.server'
import { Button } from '~/utils/forms'
import { getUserImgSrc } from '~/utils/misc'

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
	if (!user) {
		throw await authenticator.logout(request, { redirectTo: '/' })
	}
	return json({ user })
}

export default function EditUserProfile() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="container m-auto mb-36 mt-16 max-w-3xl">
			<div className="flex gap-3">
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
							src={getUserImgSrc(data.user.imageId)}
							alt={data.user.username}
							className="h-full w-full rounded-full object-cover"
						/>
					</div>
				</div>
				<Form method="post">
					<div className="grid grid-cols-6 gap-x-10">
						<div className="col-span-3">
							{/*
								🦉 this is not accessible, but don't worry,
								we've got an exercise later to make it that way
							*/}
							<label>Username</label>
							<input
								name="username"
								defaultValue={data.user.username}
								className="h-16 w-full rounded-lg border border-night-400 bg-night-700 px-4 text-body-xs caret-white outline-none focus:border-accent-purple disabled:bg-night-400"
							/>
						</div>
						<div className="col-span-3">
							{/*
								🦉 this is not accessible, but don't worry,
								we've got an exercise later to make it that way
							*/}
							<label>Name</label>
							<input
								name="name"
								defaultValue={data.user.name ?? ''}
								className="h-16 w-full rounded-lg border border-night-400 bg-night-700 px-4 text-body-xs caret-white outline-none focus:border-accent-purple disabled:bg-night-400"
							/>
						</div>
					</div>

					<div className="mt-3 flex justify-center">
						<Button type="submit" size="md-wide" variant="primary">
							Save changes
						</Button>
					</div>
				</Form>
			</div>
		</div>
	)
}
