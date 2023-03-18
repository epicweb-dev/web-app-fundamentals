# Routing

We're going to build Kody's user profile pages (Kody is a user in our app and
his username is "kody"). Users in this app can be either a host, a renter, both,
or neither. So, we want to have the following routes:

1.  `/users/kody` - The parent route that has links to the other routes
2.  `/users/kody/host` - The host's profile page
3.  `/users/kody/renter` - The renter's profile page

We share a bit of UI between the first route and the other two, but not all of
it. So we'll also be creating an `index` route for the unique stuff we should
display when the user is on the `/users/kody` route (as opposed to the
host/renter sub-routes).

These pages will get more interesting in the future, but for now, let's just
focus on the routing portion. Your job is to create four route files.

Let's start with the parent route. Following the route convention, we have a
choice of where we can place the file. We can either put it in
`routes/users_.kody.tsx` or `routes/users_+/kody.tsx`. In this case, because we
know we're going to have several routes under the `/users` path, I think it
makes the most sense to use the `users_+/` directory approach.

<InlineFile file="app/routes/users_+/kody.tsx">
	Click here to create <code>app/routes/users\_+/kody.tsx</code>
</InlineFile>

In this file, create a component and export it as the default export. You can
start that component out by returning a with a title like this:

```tsx
<div className="mt-36 mb-48">
	<h1 className="text-h1">Kody</h1>
</div>
```

Once you've got that, open <LinkToApp to="/users/kody">/users/kody</LinkToApp>.

"Kody" should be displayed on the page. One fun fact, you'll also notice the
star field and Rocket Rental logo are on the page as well, even though you
didn't render those yourself. That's because you're actually already using
nested routing! The route you just created is nested inside
<InlineFile file="app/root.tsx" line="89" />!

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
