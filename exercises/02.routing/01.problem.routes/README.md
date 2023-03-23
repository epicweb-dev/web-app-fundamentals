# Routing

👨‍💼 We got our first user! His name is "Kody" 🐨 so we're going to build Kody's
user profile pages (his username is "kody"). Users in this app can be either a
host, a renter, both, or neither. So, we want to have the following routes:

1.  `/users/kody` - The parent route that has links to the other routes
2.  `/users/kody/host` - The host's profile page
3.  `/users/kody/renter` - The renter's profile page

These pages will get more interesting in the future, but for now, let's just
focus on the routing portion. Your job is to create four route files.

Let's start with the parent route. Following the route convention, we have a
choice of where we can place the file. We can either put it in
`routes/users_.kody.tsx` or `routes/users_+/kody.tsx`. In this case, because we
know we're going to have several routes under the `/users` path, I think it
makes the most sense to use the `users_+/` directory approach.

<InlineFile file="app/routes/users_+/kody.tsx">
	🐨 Click here to create <code>app/routes/users\_+/kody.tsx</code>
</InlineFile>

🐨 In this file, create a component and export it as the default export. You can
start that component out by returning a with a title like this:

```tsx
<div className="mt-36 mb-48">
	<h1 className="text-h1">Kody</h1>
</div>
```

🐨 Once you've got that, open <LinkToApp to="/users/kody" />.

"Kody" should be displayed on the page. One fun fact, you'll also notice the
star field and Rocket Rental logo are on the page as well, even though you
didn't render those yourself. That's because you're actually **already using
nested routing!** The route you just created is nested inside
<InlineFile file="app/root.tsx" line="89" />!

Now, let's create the host route. 🐨 First,
<InlineFile file="app/routes/users_+/kody.host.tsx">create
<code>app/routes/users\_+/kody.host.tsx</code></InlineFile>, and then stick this
in it:

```tsx
export default function KodyHost() {
	return (
		<div className="container mx-auto flex flex-col items-center justify-center">
			<h2 className="text-h2">User Host</h2>
		</div>
	)
}
```

🐨 Now you can go to <LinkToApp to="/users/kody/host" />.

Uh oh! We still just have "Kody" on the screen? But the URL has our `/host`
route.

If you like, you can cd into `exercises/02.routing/01-03.problem` and run
`npx remix routes`. If you do that, it'll print this:

```tsx lines=30-32 nonumber
<Routes>
	<Route file="root.tsx">
		<Route path="admin/users/list" file="routes/admin.users.list.tsx" />
		<Route path="forgot-password" file="routes/forgot-password.tsx" />
		<Route path="images/:fileId" file="routes/images_+/$fileId.tsx" />
		<Route index file="routes/index.tsx" />
		<Route path="login" file="routes/login.tsx" />
		<Route path="logout" file="routes/logout.tsx" />
		<Route path="me" file="routes/me.tsx" />
		<Route path="onboarding" file="routes/onboarding.tsx" />
		<Route path="reset-password" file="routes/reset-password.tsx" />
		<Route
			path="resources/create-host"
			file="routes/resources+/create-host.tsx"
		/>
		<Route
			path="resources/create-renter"
			file="routes/resources+/create-renter.tsx"
		/>
		<Route
			path="resources/delete-image"
			file="routes/resources+/delete-image.tsx"
		/>
		<Route
			path="resources/image-upload"
			file="routes/resources+/image-upload.tsx"
		/>
		<Route path="resources/login" file="routes/resources+/login.tsx" />
		<Route path="signup" file="routes/signup.tsx" />
		<Route path="users/kody" file="routes/users_+/kody.tsx">
			<Route path="host" file="routes/users_+/kody.host.tsx" />
		</Route>
	</Route>
</Routes>
```

So the routes are definitely right there. What's going on? Well, remember that
we're _nesting_ our routes. And we wouldn't want Remix to just stick the UI for
each nested route one below the other. As the developer, we want to control
where the nesting actually happens. The parent contains the child which contains
the grandchild etc. So what we need is to have the parent (`/users/kody`) to
tell Remix where to put the child (`/users/kody/host`). And we do this using the
`<Outlet />` component.

Here's a quick example of how this works:

```tsx filename=app/routes/parent.tsx
export default function Parent() {
	return (
		<div>
			<h1>Parent</h1>
			<Outlet />
		</div>
	)
}
```

```tsx filename=app/routes/parent.child.tsx
export default function Child() {
	return <h2>Child</h2>
}
```

With that, when you navigate to `/parent/child`, you'll see "Parent" above
"Child". If we swap the `<h1>` and `<Outlet />` in the parent, then the child
will be above the parent. The parent gets to decide where it's child goes.

🐨 So go ahead and open the
<InlineFile file="app/routes/users_+/kody.tsx" line={4} column={99} /> file and
get the `<Outlet />` component from `@remix-run/react`, then render it below the
`<h1>` we put in there earlier.

Great! Now when we're on <LinkToApp to="/users/kody/host" />, it shows the
"Kody" title and the "User Host" text! 🎉

Let's go ahead and do the same for the renter:

- 🐨 Create the file <InlineFile file="app/routes/users_+/kody.renter.tsx" />

- 🐨 Add the following to it:

  ```tsx
  export default function KodyRenter() {
  	return (
  		<div className="container mx-auto flex flex-col items-center justify-center">
  			<h2 className="text-h2">User Renter</h2>
  		</div>
  	)
  }
  ```

- 🐨 Go to <LinkToApp to="/users/kody/renter" /> and you should get the "Kody"
  title and the "User Renter" text.

Sweet! You've got nested routing working. 🎉

When Kody is on `/users/kody`, we definitely want to show his name, but we also
have a few other things we want to show that we don't want to appear on the
other routes. So we'll also be creating an `index` route for the unique stuff we
should display when the user is on the `/users/kody` route (as opposed to the
host/renter sub-routes).

With the convention, when a route ends with the segment `index` it's treated as
an index route, so here's what we'll do:

- 🐨 Create the file <InlineFile file="app/routes/users_+/kody.index.tsx" />

- 🐨 Add the following to it:

  ```tsx
  export default function KodyIndex() {
  	return (
  		<div className="container mx-auto flex flex-col items-center justify-center">
  			<h2 className="text-h2">User Index</h2>
  		</div>
  	)
  }
  ```

- 🐨 Go to <LinkToApp to="/users/kody" /> and you should get the "Kody" title
  and the "User Index" text.

Awesome! You've got the route files made. 🎉

<TouchedFiles>
  <div id="files">
    <ul>
      <li data-state="added">
        <span>added</span>

        <InlineFile file="app/routes/users_+/kody.host.tsx" />
      </li>

      <li data-state="added">
        <span>added</span>

        <InlineFile file="app/routes/users_+/kody.index.tsx" />
      </li>

      <li data-state="added">
        <span>added</span>

        <InlineFile file="app/routes/users_+/kody.renter.tsx" />
      </li>

      <li data-state="added">
        <span>added</span>

        <InlineFile file="app/routes/users_+/kody.tsx" />
      </li>
    </ul>

  </div>
</TouchedFiles>
