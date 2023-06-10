import { Outlet } from '@remix-run/react'

export default function KodyRoute() {
	return (
		<div className="mb-48 mt-36">
			<h1 className="text-h1">Kody</h1>
			{/* 🐨 Add three Link components here, one for each page */}
			{/* 💰 I put them each in <li>s inside an <ol className="list-inside list-disc"> element */}
			{/* 💰 tip: we have support for relative routes, so no need to make the Link "to" prop start with "/users" */}
			<Outlet />
		</div>
	)
}
