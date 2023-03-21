# Route-specific Links

👨‍💼 Hey again. We've got some styles that we _only_ need applied to the homepage
and we don't want them on other routes, so we can't put them in
<InlineFile file="app/root.tsx" /> otherwise they would be loaded on every page
and that's just a waste.

The homepage code is on <InlineFile file="app/routes/index.tsx" /> and the
styles we have for it are right next to it in
<InlineFile file="app/routes/index.css" />. Can you get that CSS file to be
loaded on the homepage, but not the others? You'll know you got it when the
numbers under the heading "Nobody's better at rockets than Rocket Rental" are
nice and colorful.

Double check that the styles aren't on the page when you're on
<LinkToApp to="/login" />. You can check the network tab, or watch the `<head>`
where the `<link>` should be added/removed when you transition between the
homepage and the login page.

🦉 Remember, each route file (like <InlineFile file="app/root.tsx" /> and all
the files in `app/routes`) can export a `links` function. Not just the root
route. And those links will be on the page when that route is on the page.
Moreover, it'll even be removed when that route is not active as well.

📜
[Remix Route Styles Documentation](https://remix.run/docs/en/1.14.3/guides/styling#md-route-styles)

<TouchedFiles>
  <div id="files">
    <ul>
      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/routes/index.tsx" />
      </li>
    </ul>

  </div>
</TouchedFiles>
