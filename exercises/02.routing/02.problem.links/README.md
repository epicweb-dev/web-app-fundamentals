# Links

👨‍💼 Now that we've got route files in place, we'll want a way to link between the
routes so users can easily navigate from one route to another. To do this, we'll
use the `Link` component from `@remix-run/react`.

🐨 Add three Link elements above the `<Outlet />`. The router in Remix supports
"relative" links, so you can just pass the route name to the `to` prop. The
links should go to <LinkToApp to="/users/kody" />,

<LinkToApp to="/users/kody/host" />, and <LinkToApp to="/users/kody/renter" />.
Because these links will be rendered in the <LinkToApp to="/users/kody" />
route, you can pass the route name to the `to` prop.

The `index` route may be tricky because if you try to pass `"index"` to the `to`
prop, that will send you to <LinkToApp to="/users/kody/index" />. You could use
a full path like <LinkToApp to="/users/kody" />, but that's no fun (and it can
be annoying if you change the routing structure in the future). So instead, you
represent "the current route" with a `.`. So the `to` prop for the `index` link
should be `"."`.

Now you should be able to click on the links and see the content change as
expected along with the URL. What's great is that while multi-page apps would
have to refresh the whole page and grab all new HTML for the entire document, as
you switch between these routes only the content within the sub-route gets
updated!

<TouchedFiles>
  <div id="files">
    <ul>
      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/routes/users_+/kody.tsx" />
      </li>
    </ul>

  </div>
</TouchedFiles>
