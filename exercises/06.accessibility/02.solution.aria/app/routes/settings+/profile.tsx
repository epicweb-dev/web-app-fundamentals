import { json, redirect, type DataFunctionArgs } from '@remix-run/node'
import {
	Form,
	Link,
	Outlet,
	useActionData,
	useFetcher,
	useFormAction,
	useLoaderData,
	useNavigation,
} from '@remix-run/react'
import { useEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import * as createHost from '~/routes/resources+/create-host'
import * as createRenter from '~/routes/resources+/create-renter'
import {
	authenticator,
	getPasswordHash,
	requireUserId,
	verifyLogin,
} from '~/utils/auth.server'
import { prisma } from '~/utils/db.server'
import { Button, ErrorList, Field, TextareaField } from '~/utils/forms'
import { getUserImgSrc } from '~/utils/misc'

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			imageId: true,
			contactInfo: {
				select: {
					id: true,
					phone: true,
					address: true,
					city: true,
					state: true,
					zip: true,
					country: true,
				},
			},
			host: { select: { bio: true } },
			renter: { select: { bio: true } },
		},
	})
	if (!user) {
		await authenticator.logout(request, { redirectTo: '/' })
		throw redirect('/')
	}
	return json({ user })
}

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const {
		name,
		username,
		currentPassword,
		newPassword,
		renterBio,
		hostBio,
		phone,
		address,
		city,
		state,
		zip,
		country,
	} = Object.fromEntries(await request.formData())
	invariant(typeof name === 'string', 'name must be a string')
	invariant(typeof username === 'string', 'username must be a string')
	invariant(typeof phone === 'string', 'phone must be a string')
	invariant(typeof address === 'string', 'address must be a string')
	invariant(typeof city === 'string', 'city must be a string')
	invariant(typeof state === 'string', 'state must be a string')
	invariant(typeof zip === 'string', 'zip must be a string')
	invariant(typeof country === 'string', 'country must be a string')

	const errors = {
		formErrors: [] as Array<string>,
		fieldErrors: {} as Record<string, Array<string> | undefined>,
	}

	if (newPassword) {
		invariant(
			typeof currentPassword === 'string',
			'currentPassword must be a string',
		)
		if (currentPassword) {
			const currentUser = await prisma.user.findUnique({
				where: { id: userId },
				select: { username: true },
			})
			if (!currentUser) {
				await authenticator.logout(request, { redirectTo: '/' })
				throw redirect('/')
			}

			const valid = await verifyLogin(currentUser.username, currentPassword)
			if (!valid) {
				errors.fieldErrors.currentPassword = ['Incorrect']
			}
		} else {
			errors.fieldErrors.currentPassword = ['Required']
		}
	}
	if (name.length < 3) {
		errors.fieldErrors.name = ['Must be at least 3 characters']
	}
	if (username.length < 3) {
		errors.fieldErrors.username = ['Must be at least 3 characters']
	}
	// etc...

	if (
		errors.formErrors.length ||
		Object.values(errors.fieldErrors).some(errors => errors?.length)
	) {
		return json({ status: 'error', errors } as const, { status: 400 })
	}

	await prisma.user.update({
		select: { id: true },
		where: { id: userId },
		data: {
			name,
			username,
			contactInfo: {
				upsert: {
					create: { phone, address, city, state, zip, country },
					update: { phone, address, city, state, zip, country },
				},
			},
			password:
				typeof newPassword === 'string' && newPassword
					? {
							update: {
								hash: await getPasswordHash(newPassword),
							},
					  }
					: undefined,
			host:
				typeof hostBio === 'string' ? { update: { bio: hostBio } } : undefined,
			renter:
				typeof renterBio === 'string'
					? { update: { bio: renterBio } }
					: undefined,
		},
	})

	return json({ status: 'success' } as const)
}

function usePreviousValue<Value>(value: Value): Value {
	const ref = useRef<Value>(value)
	useEffect(() => {
		ref.current = value
	}, [value])
	return ref.current
}

export default function EditUserProfile() {
	const data = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()
	const navigation = useNavigation()
	const formAction = useFormAction()
	const createHostFetcher = useFetcher<typeof createHost.action>()
	const createRenterFetcher = useFetcher<typeof createRenter.action>()

	const hasFormErrors = Boolean(
		actionData?.status === 'error'
			? actionData.errors.formErrors.length
			: false,
	)

	const fieldErrors =
		actionData?.status === 'error' ? actionData.errors.fieldErrors : {}

	const hostBioTextareaRef = useRef<HTMLTextAreaElement>(null)
	const renterBioTextareaRef = useRef<HTMLTextAreaElement>(null)

	const isSubmitting =
		navigation.state === 'submitting' &&
		navigation.formAction === formAction &&
		navigation.formMethod === 'post'

	const prevWasHost = usePreviousValue(Boolean(data.user.host))
	const isNewHost = !prevWasHost && Boolean(data.user.host)
	useEffect(() => {
		if (!hostBioTextareaRef.current) return
		if (isNewHost) {
			hostBioTextareaRef.current.focus()
		}
	}, [isNewHost])

	const prevWasRenter = usePreviousValue(Boolean(data.user.renter))
	const isNewRenter = !prevWasRenter && Boolean(data.user.renter)
	useEffect(() => {
		if (!renterBioTextareaRef.current) return
		if (isNewRenter) {
			renterBioTextareaRef.current.focus()
		}
	}, [isNewRenter])

	const createHostFormId = 'create-host-form'
	const createRenterFormId = 'create-renter-form'
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
						<Link
							to="photo"
							className="absolute top-3 -right-3 flex h-4 w-4 items-center justify-center rounded-full border-4 border-night-700 bg-night-500 p-5"
						>
							📷
						</Link>
					</div>
				</div>
				<Form
					method="post"
					aria-invalid={hasFormErrors ? true : undefined}
					aria-errormessage={hasFormErrors ? 'form-errors' : undefined}
				>
					<div className="grid grid-cols-6 gap-x-10">
						<Field
							className="col-span-3"
							labelProps={{ children: 'Username' }}
							inputProps={{
								name: 'username',
								defaultValue: data.user.username,
							}}
							errors={fieldErrors.username}
						/>
						<Field
							className="col-span-3"
							labelProps={{ children: 'Name' }}
							inputProps={{
								name: 'name',
								defaultValue: data.user.name ?? '',
							}}
							errors={fieldErrors.name}
						/>
						<Field
							className="col-span-3"
							labelProps={{ children: 'Email' }}
							inputProps={{
								name: 'email',
								defaultValue: data.user.email ?? '',
								// TODO: support changing your email address
								disabled: true,
							}}
							errors={fieldErrors.email}
						/>
						<Field
							className="col-span-3"
							labelProps={{ children: 'Phone' }}
							inputProps={{
								name: 'phone',
								defaultValue: data.user.contactInfo?.phone ?? '',
							}}
							errors={fieldErrors.phone}
						/>
						<Field
							className="col-span-3"
							labelProps={{ children: 'Address' }}
							inputProps={{
								name: 'address',
								defaultValue: data.user.contactInfo?.address ?? '',
							}}
							errors={fieldErrors.address}
						/>
						<Field
							className="col-span-3"
							labelProps={{ children: 'City' }}
							inputProps={{
								name: 'city',
								defaultValue: data.user.contactInfo?.city ?? '',
							}}
							errors={fieldErrors.city}
						/>
						<Field
							className="col-span-2"
							labelProps={{ children: 'State' }}
							inputProps={{
								name: 'state',
								defaultValue: data.user.contactInfo?.state ?? '',
							}}
							errors={fieldErrors.state}
						/>
						<Field
							className="col-span-2"
							labelProps={{ children: 'Zip' }}
							inputProps={{
								name: 'zip',
								defaultValue: data.user.contactInfo?.zip ?? '',
							}}
							errors={fieldErrors.zip}
						/>
						<Field
							className="col-span-2"
							labelProps={{ children: 'Country' }}
							inputProps={{
								name: 'country',
								defaultValue: data.user.contactInfo?.country ?? '',
							}}
							errors={fieldErrors.country}
						/>

						<div className="relative col-span-3">
							{data.user.host ? null : (
								<div className="absolute inset-0 z-10 backdrop-blur-[1px]" />
							)}
							<TextareaField
								labelProps={{
									children: 'Host Bio',
								}}
								textareaProps={{
									name: 'hostBio',
									defaultValue: data.user.host?.bio ?? '',
									disabled: !data.user.host,
									ref: hostBioTextareaRef,
								}}
							/>
							{data.user.host ? null : (
								<div className="absolute inset-0 z-20 flex items-center justify-center">
									<div className="flex min-h-[70px] w-[300px] flex-col items-center drop-shadow-md">
										<Button
											size="sm"
											variant="secondary"
											type="submit"
											form={createHostFormId}
											aria-errormessage={
												createHostFetcher.data?.status === 'error'
													? 'create-host-error'
													: undefined
											}
										>
											Become a Host
										</Button>
										<div className="px-4 pt-1">
											<ErrorList
												id="create-host-error"
												errors={
													createHostFetcher.data?.status === 'error'
														? createHostFetcher.data.errors
														: null
												}
											/>
										</div>
									</div>
								</div>
							)}
						</div>
						<div className="relative col-span-3">
							{data.user.renter ? null : (
								<div className="absolute inset-0 z-10 backdrop-blur-[1px]" />
							)}
							<TextareaField
								className="col-span-3"
								labelProps={{
									children: 'Renter Bio',
								}}
								textareaProps={{
									name: 'renterBio',
									defaultValue: data.user.renter?.bio ?? '',
									disabled: !data.user.renter,
									ref: renterBioTextareaRef,
								}}
							/>
							{data.user.renter ? null : (
								<div className="absolute inset-0 z-20 flex items-center justify-center">
									<div className="flex min-h-[70px] w-[300px] flex-col items-center drop-shadow-md">
										<Button
											size="sm"
											variant="secondary"
											type="submit"
											form={createRenterFormId}
											aria-errormessage={
												createRenterFetcher.data?.status === 'error'
													? 'create-renter-error'
													: undefined
											}
										>
											Become a Renter
										</Button>
										<div className="px-4 pt-1">
											<ErrorList
												id="create-renter-error"
												errors={
													createRenterFetcher.data?.status === 'error'
														? createRenterFetcher.data.errors
														: null
												}
											/>
										</div>
									</div>
								</div>
							)}
						</div>
						<div className="col-span-6 mt-6 mb-12 h-1 border-b-[1.5px] border-night-500" />
						<fieldset className="col-span-6">
							<legend className="pb-6 text-lg text-night-200">
								Change password
							</legend>
							<div className="flex justify-between gap-10">
								<Field
									className="flex-1"
									labelProps={{ children: 'Current Password' }}
									inputProps={{
										name: 'currentPassword',
										type: 'password',
										autoComplete: 'current-password',
									}}
									errors={fieldErrors.currentPassword}
								/>
								<Field
									className="flex-1"
									labelProps={{
										children: 'New Password',
									}}
									inputProps={{
										name: 'newPassword',
										type: 'password',
										autoComplete: 'new-password',
									}}
									errors={fieldErrors.newPassword}
								/>
							</div>
						</fieldset>
					</div>

					{actionData?.status === 'error' && actionData.errors.formErrors ? (
						<ErrorList id="form-errors" errors={actionData.errors.formErrors} />
					) : null}

					<div className="mt-3 flex justify-center">
						<Button
							type="submit"
							size="md-wide"
							variant="primary"
							status={isSubmitting ? 'pending' : actionData?.status ?? 'idle'}
						>
							Save changes
						</Button>
					</div>
				</Form>

				<createHostFetcher.Form
					method="post"
					action={createHost.ROUTE_PATH}
					id={createHostFormId}
				/>
				<createRenterFetcher.Form
					method="post"
					action={createRenter.ROUTE_PATH}
					id={createRenterFormId}
				/>
			</div>
			<Outlet />
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
