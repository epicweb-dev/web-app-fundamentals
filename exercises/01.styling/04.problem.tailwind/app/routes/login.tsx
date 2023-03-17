import { useSearchParams } from '@remix-run/react'
import { Spacer } from '~/components/spacer'
import { InlineLogin } from './resources+/login'

export default function LoginPage() {
	const [searchParams] = useSearchParams()

	const redirectTo = searchParams.get('redirectTo') || '/'

	return (
		<div className="flex min-h-full flex-col justify-center pt-20 pb-32">
			<div className="mx-auto w-full max-w-md">
				<div className="flex flex-col gap-3 text-center">
					<h1 className="text-h1">Welcome back!</h1>
					<p className="text-body-md text-night-200">
						Please enter your details.
					</p>
				</div>
				<Spacer size="xs" />
				<InlineLogin redirectTo={redirectTo} />
			</div>
		</div>
	)
}
