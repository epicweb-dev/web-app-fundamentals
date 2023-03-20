import { Outlet } from '@remix-run/react'

export default function UserRoute() {
	return (
		<div className="mt-36 mb-48">
			<Outlet />
		</div>
	)
}
