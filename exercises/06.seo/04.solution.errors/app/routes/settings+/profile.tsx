import {
	json,
	redirect,
	type DataFunctionArgs,
	type V2_MetaFunction,
} from '@remix-run/node'
import {
	Form,
	Link,
	useFormAction,
	useLoaderData,
	useNavigation,
} from '@remix-run/react'
import invariant from 'tiny-invariant'
import { authenticator, requireUserId } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { Button, Field } from '~/utils/forms.tsx'
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
	const navigation = useNavigation()
	const formAction = useFormAction()

	const isSubmitting =
		navigation.state === 'submitting' &&
		navigation.formAction === formAction &&
		navigation.formMethod === 'post'

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
							disabled={isSubmitting}
							status={isSubmitting ? 'pending' : 'idle'}
						>
							Save changes
						</Button>
					</div>
				</Form>
			</div>
		</div>
	)
}

export const meta: V2_MetaFunction = () => {
	return [
		{ title: 'Edit Profile | Rocket Rental' },
		{
			name: 'description',
			content: 'Edit your personal Rocket Rental profile',
		},
	]
}
