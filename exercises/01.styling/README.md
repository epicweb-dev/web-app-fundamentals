# Styling Web Apps

## The web

HTML, CSS, and JavaScript. These are the foundational technologies upon which
everything else on the web is based. They work together to create the excellent
user experiences our users expect in web applications today.

To get CSS loaded into your web application, there are a few options, but the
best is to load a stylesheet file (in a `.css` file extension) via a special
HTML tag called `<link>`.

```html
<link rel="stylesheet" href="styles.css" />
```

The `link` tag is a element that establishes a relationship between the HTML
document and an external resource. In this case, the `rel` attribute is set to
`stylesheet` and the `href` attribute is set to `styles.css`. This tells the
browser to load the CSS from the `styles.css` file. (Presumably the same server
that sent the HTML document is prepared to serve the CSS file as well).

The `link` tag can also be used to link to other types of resources, but we'll
be focusing on stylesheets for now.

## In Remix

Remix embraces the web platform API for loading stylesheets by exposing a
special convention for routes to define `link` elements that should be on the
page when the route is active. We'll talk about routing in the next exercise,
but it's important to understand for now that each file in the `app/routes`
directory of a Remix app is a route which can define a set of `link` elements.
Also, you should know that the `app/root.tsx` file is the root route of your
entire application and will be rendered on every page.

Here's an example of what that convention looks like:

```tsx filename=app/root.tsx
// ...
import { type LinksFunction } from '@remix-run/node'

export const links: LinksFunction = () => {
	return [
		{
			rel: 'stylesheet',
			href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css',
		},
		{
			rel: 'stylesheet',
			href: 'https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css',
		},
	]
}

//...
```

The links configured above will be rendered in the `<head>` of the HTML document
that is sent to the browser. Again, you can define any links you like, but we're
focusing on `stylesheet` links.

Additionally, Remix has a special way to colocate your CSS stylesheets within
your application allowing you to `import` a `.css` file. We'll explain these
methods further in the exercise steps, but here are some of the built-in
supported features:

- Specifying a `default` import (like
  `import stylesheetUrl from './styles.css'`) will copy the CSS file to your
  `public` directory allowing you to link to the copied file.
- When properly configured `import './styles.css'` will load the CSS file and
  add it to a special stylesheet you can link.
- When properly configured `import './styles.module.css'` will load the CSS file
  as a [CSS Module](https://github.com/css-modules/css-modules) and give you an
  object of class names you can apply when you've loaded the special CSS file.
- If a `postcss.config.js` file is present in your application, Remix will
  automatically run your CSS through [PostCSS](https://postcss.org/). If none is
  present, but a `tailwind.config.js` is found, Remix will run your CSS through
  [Tailwind](https://tailwindcss.com/).
- When properly configured, you can even use
  [`vanilla-extract`](https://vanilla-extract.style/) to define your styles in a
  `.css.ts` file.

We're going to explore most of these approaches to style a web application. In
our application, most of our styling is done through
[Tailwind](https://tailwindcss.com/) with some regular stylesheets and CSS
Modules sprinkled in.

> A note about CSS-in-JS: Remix does support typical CSS-in-JS libraries, but
> recommends tools that expose a CSS file for linking. It's just a better user
> experience. Tailwind especially is great because the CSS file never grows very
> big regardless of how large your application grows.
