import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/db.server'
import { getUserImgSrc } from '~/utils/misc'

export async function loader() {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			username: true,
			imageId: true,
			host: {
				include: {
					_count: {
						select: {
							ships: true,
							renterReviews: true,
						},
					},
				},
			},
			renter: {
				include: {
					_count: {
						select: {
							bookings: true,
							hostReviews: true,
						},
					},
				},
			},
		},
	})
	return json({ users })
}

export default function UserList() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="container mx-auto pt-20 pb-32">
			<h1 className="text-h1">User List</h1>
			<p className="text-night-200">A list of users for you...</p>
			<p className="text-body-sm text-night-300">
				Passwords for the seeded users are the same as the username.
			</p>
			<ul className="mt-20 flex flex-wrap justify-between gap-12">
				{data.users.map(user => (
					<li key={user.id}>
						<div className="flex flex-col gap-4">
							<Link
								to={`/users/${user.username}`}
								className="flex flex-col items-center justify-center gap-2"
							>
								<img
									src={getUserImgSrc(user.imageId)}
									alt={user.username}
									className="h-24 w-24 rounded-full"
								/>
								<div className="text-body-md">{user.name ?? 'Unnamed'}</div>
								<div className="text-body-md">{user.username}</div>
							</Link>
							{user.host ? (
								<div>
									<Link to={`/users/${user.username}/host`}>Host:</Link>
									<ul>
										<li>Ships: {user.host._count.ships}</li>
										<li>Renter Reviews: {user.host._count.renterReviews}</li>
									</ul>
								</div>
							) : null}
							{user.renter ? (
								<div>
									<Link to={`/users/${user.username}/renter`}>Renter:</Link>
									<ul>
										<li>Bookings: {user.renter._count.bookings}</li>
										<li>Host Reviews: {user.renter._count.hostReviews}</li>
									</ul>
								</div>
							) : null}
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
