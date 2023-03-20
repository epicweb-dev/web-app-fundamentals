import { Outlet } from '@remix-run/react'

export default function KodyRoute() {
	return (
		<div className="mt-36 mb-48">
			<h1 className="text-h1">Kody</h1>
			<Outlet />
		</div>
	)
}
