import {
	isRouteErrorResponse,
	useParams,
	useRouteError,
} from '@remix-run/react'
import { type ErrorResponse } from '@remix-run/router'

type StatusHandler = (info: {
	error: ErrorResponse
	params: Record<string, string | undefined>
}) => JSX.Element | null

export function GeneralErrorBoundary({
	defaultStatusHandler = ({ error }) => (
		<p>
			{error.status} {error.data}
		</p>
	),
	statusHandlers,
	unexpectedErrorHandler = () => (
		<p>Oh no, something went wrong. Sorry about that.</p>
	),
}: {
	defaultStatusHandler?: StatusHandler
	statusHandlers?: Record<number, StatusHandler>
	unexpectedErrorHandler?: (error: unknown) => JSX.Element | null
}) {
	const error = useRouteError()
	const params = useParams()
	console.error(error)

	return (
		<div className="container mx-auto flex items-center justify-center p-20 text-h2 text-accent-red">
			{isRouteErrorResponse(error)
				? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
						error,
						params,
				  })
				: unexpectedErrorHandler(error)}
		</div>
	)
}
