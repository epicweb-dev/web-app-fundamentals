# Bundling CSS

👨‍💼 As great as Tailwind is, sometimes it's necessary to use regular CSS. And
while we can easily import CSS files in routes, we can't as easily manage this
in non-route files (like components that are used on lots of pages). We've got
components like this! Checkout the <LinkToApp to="/login" /> page. Those inputs
aren't supposed to look that way. Those inputs are `<Field />` components that
are styled by <InlineFile file="app/utils/forms.module.css" /> which is a CSS
Modules file.

Because we don't want to load this CSS file on every page, and we also don't
want to have to list every component-level CSS file in our root route, we're
going to use yet another built-in feature of Remix that allows us to tell Remix
where to put global styles we import. In Remix, this is called 📜
["CSS Bundling"](https://remix.run/docs/en/main/guides/styling#md-css-bundling).

We already have `@remix-run/css-bundle` installed, so all that's left is to
`import` it, and list it in the links of our <InlineFile file="app/root.tsx" />.

You'll know it's working, when the fields on <LinkToApp to="/login" /> look
amazing.

<TouchedFiles>
  <div id="files">
    <ul>
      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/root.tsx" />
      </li>
    </ul>

  </div>
</TouchedFiles>
