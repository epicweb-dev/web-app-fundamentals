import { Link, useFetcher } from '@remix-run/react'
import { z } from 'zod'
import {
	Button,
	CheckboxField,
	Field,
	getFieldsFromSchema,
	useForm,
} from '~/utils/forms.tsx'
import { passwordSchema, usernameSchema } from '~/utils/user-validation.ts'

export const LoginFormSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
	redirectTo: z.string().optional(),
	remember: z.boolean(),
})

export function InlineLogin({
	redirectTo,
	formError,
}: {
	redirectTo?: string
	formError?: string | null
}) {
	const loginFetcher = useFetcher()

	const { form, fields } = useForm({
		name: 'inline-login',
		errors: {
			...loginFetcher.data?.errors,
			formErrors: [
				formError,
				...(loginFetcher.data?.errors?.formErrors ?? []),
			].filter(Boolean),
		},
		fieldMetadatas: getFieldsFromSchema(LoginFormSchema),
	})

	return (
		<div>
			<div className="mx-auto w-full max-w-md px-8">
				<loginFetcher.Form
					method="post"
					action="/resources/login"
					{...form.props}
				>
					<Field
						labelProps={{ ...fields.username.labelProps, children: 'Username' }}
						inputProps={{
							...fields.username.props,
							autoComplete: 'username',
						}}
						errors={fields.username.errors}
					/>

					<Field
						labelProps={{ ...fields.password.labelProps, children: 'Password' }}
						inputProps={{
							...fields.password.props,
							autoComplete: 'password',
							type: 'password',
						}}
						errors={fields.password.errors}
					/>

					<div className="flex justify-between">
						<CheckboxField
							labelProps={{
								...fields.remember.labelProps,
								children: 'Remember me',
							}}
							buttonProps={fields.remember.props}
							errors={fields.remember.errors}
						/>

						<div>
							<Link
								to="/forgot-password"
								className="text-body-xs font-semibold"
							>
								Forgot password?
							</Link>
						</div>
					</div>

					<input
						value={redirectTo}
						{...fields.redirectTo.props}
						type="hidden"
					/>

					{form.errorUI}

					<div className="flex items-center justify-between gap-6 pt-3">
						<Button
							className="w-full"
							size="md"
							variant="primary"
							status={
								loginFetcher.state === 'submitting'
									? 'pending'
									: loginFetcher.data?.status ?? 'idle'
							}
							type="submit"
							disabled={loginFetcher.state !== 'idle'}
						>
							Log in
						</Button>
					</div>
				</loginFetcher.Form>
				<div className="flex items-center justify-center gap-2 pt-6">
					<span className="text-night-200">New here?</span>
					<Link to="/signup">Create an account</Link>
				</div>
			</div>
		</div>
	)
}
