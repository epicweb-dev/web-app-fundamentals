import { Outlet } from '@remix-run/react'

export default function KodyRoute() {
	return (
		<div className="mb-48 mt-36">
			<h1 className="text-h1">Kody</h1>
			<Outlet />
		</div>
	)
}
