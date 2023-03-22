# Loading Data

👨‍💼 It's great that our user profiles show their username, but it would be
greater if we could show their name and other useful information as well. Also,
we're going to start working on the user's settings page, and we'll need to load
the user's data there as well for the `defaultValue` of the inputs. We've
already created all those routes, so all we need now is to have some `loaders`
to load some data.

You should know that we've already got user authentication finished in this app,
and you'll be using some utilities from
<InlineFile file="app/utils/auth.server.ts" />. Luckily, you shouldn't need to
make any changes to that file, but some of those functions will help you
determine who the current user is.

On that note, we've also got a special route for you to find users to test your
work out with. It's <LinkToApp to="/admin/users/list" />. That will list the
users in the app and give you some basic info about each so you can test a
couple different users.

You should also know, you can login as any user by using their username as the
password. You'll need this when you test out the
<LinkToApp to="/settings/profile" /> page. (🐨 Kody insisted on being an
exception to this rule. His username is `kody` and his password is
`kodylovesyou` 🙄 🥰).

We're going to let you focus on the data loading, so in the next step, the UI
will be created for you. Just get that data in the UI and we'll handle the rest.

Your emoji friends will be in there to give you a hand, so get started!

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
