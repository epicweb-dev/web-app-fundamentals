import { Outlet } from '@remix-run/react'

// ❗💰 I suggest you do the loader in app/routes/settings+/profile.tsx first
// because I have some tips in there that will help you here.

// 🐨 export a loader function here
// 💰 Here's the query you need to get the data we need for this page:
// const user = await prisma.user.findUnique({
// 	where: { username: params.username },
// })

// On this route, all we need to know is whether the user looking at this profile
// is the same user as the profile they're looking at. So, you can determine
// who the current user is using `getUserId` from '~/utils/auth.server'
// (this will return null if the user is not logged in).
// 🐨 compare the userId from the request to the user.id from the database
// and return a json response with {isSelf: true} or {isSelf: false}

export default function UserRoute() {
	// 🐨 instead of this hard-coded object, we can get the data from the loader
	// using the `useLoaderData` hook from '@remix-run/react'
	const data = { todo: 'you need to do this' }

	return (
		<div className="mt-36 mb-48">
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<Outlet />
		</div>
	)
}
