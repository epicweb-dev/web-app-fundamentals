import { json, type DataFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { authenticator, requireUserId } from '~/utils/auth.server.ts'
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
				{/*
					🐨 Create a form using the <Form> component from `@remix-run/react`.
					It should contain two fields:
					- name
					- username
					and one submit button with the text "Save Changes"

					// 🐨 Make sure to set the "method" prop to "post" on the <Form> component
					// 🦉 you could also set the "action" to "/settings/profile", but that is the default so you can leave that off.

					// 💰 if you want the inputs to look nice, use the following className on the <input />
					// className="h-16 w-full rounded-lg border border-night-400 bg-night-700 px-4 text-body-xs caret-white outline-none focus:border-accent-purple disabled:bg-night-400"
					// 🦉 Don't worry, we've got a reusable component for you to use later... For now, <label> and <input> are fine.

					// 💰 You can use the <Button> component from `~/utils/forms` to make the button look nice
					// the variant prop should be "primary" and the size prop should be "md-wide"
					// 🐨 Make sure the button's type prop is "submit"
				*/}
			</div>
		</div>
	)
}
