import { Link, Outlet } from '@remix-run/react'

export default function KodyRoute() {
	// 🐨 get the params from useParams
	return (
		<div className="mt-36 mb-48">
			{/* 🐨 swap "Kody" with params.username */}
			{/* 💰 it won't work until after you've changed the filename */}
			<h1 className="text-h1">Kody</h1>
			<ol className="list-inside list-disc">
				<li>
					<Link to=".">Index</Link>
				</li>
				<li>
					<Link to="host">Host</Link>
				</li>
				<li>
					<Link to="renter">Renter</Link>
				</li>
			</ol>
			<Outlet />
		</div>
	)
}
