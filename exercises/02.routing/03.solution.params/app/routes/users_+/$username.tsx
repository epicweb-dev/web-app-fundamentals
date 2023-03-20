import { Link, Outlet, useParams } from '@remix-run/react'

export default function UserRoute() {
	const params = useParams()

	return (
		<div className="mt-36 mb-48">
			<h1 className="text-h1">{params.username}</h1>
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
