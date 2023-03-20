// 🐨 export a loader function here
// 🦺 make sure to use the DataFunctionArgs type from '@remix-run/node'
// 💰 here's the prisma query you need to get the data we need for this page:
// const user = await prisma.user.findUnique({
// 	where: { id: userId },
// 	select: {
// 		id: true,
// 		name: true,
// 		username: true,
// 		imageId: true,
// 	},
// })
// 💰 `prisma` comes from '~/utils/db.server'
// 💰 you get the `userId` from the request object using the
// `requireUserId` function from '~/utils/auth.server'
// 🐨 return the data ({ user }) as json using the json utility from '@remix-run/node'

export default function EditUserProfile() {
	// 🐨 instead of this hard-coded object, we can get the data from the loader
	// using the `useLoaderData` hook from '@remix-run/react'
	const data = { todo: 'you need to implement the loader first...' }

	return <pre>{JSON.stringify(data, null, 2)}</pre>
}
