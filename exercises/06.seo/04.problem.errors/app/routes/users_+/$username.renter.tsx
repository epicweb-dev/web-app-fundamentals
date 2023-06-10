import {
	json,
	type DataFunctionArgs,
	type V2_MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { getUserId } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { useOptionalUser } from '~/utils/misc.ts'
import { Reviews, UserProfileBasicInfo } from './__shared.tsx'

export async function loader({ request, params }: DataFunctionArgs) {
	const loggedInUserId = await getUserId(request)
	invariant(params.username, 'Missing username')
	const user = await prisma.user.findUnique({
		where: { username: params.username },
		select: {
			id: true,
			username: true,
			name: true,
			imageId: true,
			renter: {
				select: {
					userId: true,
					bio: true,
					createdAt: true,
					reviews: {
						select: {
							id: true,
							content: true,
							rating: true,
							reviewer: {
								select: {
									user: {
										select: {
											imageId: true,
											name: true,
											username: true,
										},
									},
								},
							},
							booking: {
								select: {
									ship: {
										select: {
											id: true,
											name: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	})
	if (!user?.renter) {
		throw new Response('not found', { status: 404 })
	}

	const totalBookings = await prisma.booking.count({
		where: {
			AND: [{ renterId: user.id }, { endDate: { lte: new Date() } }],
		},
	})
	const averageReviews = await prisma.renterReview.aggregate({
		where: { subjectId: user.id },
		_avg: { rating: true },
	})
	const oneOnOneChat = loggedInUserId
		? await prisma.chat.findFirst({
				where: {
					users: {
						every: {
							id: { in: [user.id, loggedInUserId] },
						},
					},
				},
				select: { id: true },
		  })
		: null

	return json({
		user,
		oneOnOneChat,
		userJoinedDisplay: user.renter.createdAt.toLocaleDateString(),
		totalBookings,
		rating: averageReviews._avg.rating,
	})
}

export default function RenterUser() {
	const data = useLoaderData<typeof loader>()

	// it's unclear why this is necessary 🤷‍♂️
	invariant(data.user.renter, 'This should not be possible...')

	const loggedInUser = useOptionalUser()
	const isLoggedInUser = loggedInUser?.id === data.user.id

	return (
		<div className="mt-11">
			<UserProfileBasicInfo
				user={data.user}
				rating={data.rating}
				userJoinedDisplay={data.userJoinedDisplay}
				isSelf={isLoggedInUser}
				stats={[
					{ label: 'trips', num: data.totalBookings },
					{ label: 'reviews', num: data.user.renter.reviews.length },
				]}
				bio={data.user.renter.bio}
			/>

			<Reviews
				title={`${data.user.renter.reviews.length} reviews from hosts`}
				user={data.user}
				rating={data.rating}
				reviews={data.user.renter.reviews}
				reviewerType="host"
			/>
		</div>
	)
}

// 🐨 destructure params alongside the data in this function
export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
	// 🐨 use params to get the username for the fallback
	// 🐨 handle the case where data is undefined
	const displayName = data.user.name ?? data.user.username
	return [
		{ title: `${displayName} | Rocket Rental Renter` },
		{
			name: 'description',
			content: `${displayName} has flown ${
				// 🐨 handle the case where data is undefined
				data.totalBookings
			} times in rockets on Rocket Rental.`,
		},
	]
}
