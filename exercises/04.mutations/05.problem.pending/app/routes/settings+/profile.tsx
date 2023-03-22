import { json, redirect, type DataFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { authenticator, requireUserId } from '~/utils/auth.server'
import { prisma } from '~/utils/db.server'
import { Button, Field } from '~/utils/forms'
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

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const name = formData.get('name')
	const username = formData.get('username')
	invariant(typeof name === 'string', 'name must be a string')
	invariant(typeof username === 'string', 'username must be a string')

	const updatedUser = await prisma.user.update({
		select: { username: true },
		where: { id: userId },
		data: { name, username },
	})

	return redirect(`/users/${updatedUser.username}`)
}

export default function EditUserProfile() {
	const data = useLoaderData<typeof loader>()

	// 🐨 determine whether the form is being submitted by checking:
	// - navigation state (should be 'submitting')
	// - navigation formAction (should be the formAction you get from useFormAction)
	// - navigation formMethod (should be 'post')

	return (
		<div className="container m-auto mt-16 mb-36 max-w-3xl">
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
						<Field
							className="col-span-3"
							labelProps={{ children: 'Username' }}
							inputProps={{
								name: 'username',
								defaultValue: data.user.username,
							}}
						/>
						<Field
							className="col-span-3"
							labelProps={{ children: 'Name' }}
							inputProps={{
								name: 'name',
								defaultValue: data.user.name ?? '',
							}}
						/>
					</div>

					<div className="mt-3 flex justify-center">
						<Button
							type="submit"
							size="md-wide"
							variant="primary"
							// 🐨 add the disabled prop here when we're in the submitting state
							// 🐨 add status prop set to "pending" when we're in the submitting state
							// or "idle" otherwise
						>
							Save changes
						</Button>
					</div>
				</Form>
			</div>
		</div>
	)
}
