# Bundling CSS

👨‍💼 Great work! Now, we can not only use CSS Modules, but we can also import
regular stylesheets and have them applied by simply importing them as
"side-effect" imports like this:

```tsx
import './styles.css'
```

That will bundle them up and they'll be a part of wherever we use the
`@remix-run/css-bundle` package (which in typical applications will be in the
root route like we did).

This also allows us to use Vanilla Extract, though we haven't configured that
for this app because we're happy with what we have set up currently.

Awesome job!
