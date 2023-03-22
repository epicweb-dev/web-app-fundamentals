# Handle Missing Data

👨‍💼 One of our Quality Assurance folks discovered an issue. If you go to a user
that does not exist, the app crashes. For example, try this one:
<LinkToApp to="/users/i-do-not-exist" /> 😬

We need to handle this case. That should be a `404` error. So after trying to
get the `user` from the database, you're going to need to check whether the
returned `user` exists. If they don't, then you should throw a `404` error.
Here's an example how you do that:

```tsx filename=app/routes/sandwiches.$id.tsx
export async function loader({ params }) {
	const sandwich = await db.sandwich.findFirst({
		where: { id: params.id },
	})

	if (!sandwich) {
		throw new Response('sandwich not found', { status: 404 })
	}

	return json({ sandwich })
}
```

We'll make a nicer looking error page later. For now, just handling the error
with a proper status code is enough.

We also have an issue with the settings page. If someone tries going to
<LinkToApp to="/settings/profile" /> when they're logged in, but their user
account was deleted, it blows up on them. Instead, it should log them out and
redirect them to home. I know I know, this is an edge case, but we really need
to handle it! Thanks!

<TouchedFiles>
  <div id="files">
    <ul>
      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/routes/settings+/profile.tsx" />
      </li>

      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/routes/users_+/$username.tsx" />
      </li>
    </ul>

  </div>
</TouchedFiles>
