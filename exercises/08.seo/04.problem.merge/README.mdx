# Merge Meta

👨‍💼 Oh no! Did you notice that we've lost the `charSet` and `viewport` meta tags?
Remember when we learned that as soon as you export a `meta` from a route, the
ancestor's `meta` is overridden? Whelp, that's what's going on here. Our `meta`
`export` has access to the ancestor's `meta` values, so we just need to grab the
things we like, and override the things we don't.

This is a bit annoying, so I've got a handy utility for you to use (written by
Ryan Florence, one of the maintainers of Remix). It's already written for you
and ready (<InlineFile file="app/utils/misc.ts" line="90" />) and here's how you
use it:

```tsx
export const meta = mergeMeta<typeof loader>(
	({ data, params }) => {
		return [] // <-- these will override the ancestor's meta
	},
	({ data, params }) => {
		return [] // <-- these will be appended to the ancestor's meta
	},
)
```

There are use cases for simply appending rather than overriding, but we don't
have them today, so you'll just use the first callback.

<TouchedFiles>
  <div id="files">
    <ul>
      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/routes/users_+/$username.host.tsx" />
      </li>

      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/routes/users_+/$username.index.tsx" />
      </li>

      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/routes/users_+/$username.renter.tsx" />
      </li>
    </ul>

  </div>
</TouchedFiles>
