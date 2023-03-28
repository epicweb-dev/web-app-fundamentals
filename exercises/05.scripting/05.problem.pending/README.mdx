# Pending UI

👨‍💼 Some of our users have complained that the UI doesn't feel responsive because
after they submit their profile form, it can take a while before there are any
updates and they're not sure whether they did something wrong.

Could you give them some feedback while they're waiting for the server to
respond?

Remix allows you to give the user an even better experience by showing "pending
UI" using
[the `useNavigation` hook](https://remix.run/docs/en/main/hooks/use-navigation).

Here's an over-the-top example of `useNavigation` that should help you get a
sense of the information you can get from the `navigation` object (as well as
[the `useFormAction` hook](https://remix.run/docs/en/main/hooks/use-form-action)).

```tsx filename=app/routes/sandwiches.chooser.tsx
export default function SandwichChooser() {
	const navigation = useNavigation()
	const formAction = useFormAction()
	const isSubmitting = navigation.state === 'submitting'
	const isRevalidating = navigation.state === 'loading'
	const isFormAction = navigation.formAction === formAction
	const isFormMethod = navigation.formMethod === 'post'
	const submittedSandwichType = navigation.formData?.get('sandwichType')
	const isRedirecting =
		isRevalidating && navigation.formAction !== navigation.location.pathname
	return (
		<Form method="post">
			<label>
				Type: <input name="sandwichType" />
			</label>
			<button type="submit" disabled={isSubmitting}>
				{isRedirecting
					? `All done... redirecting...`
					: isSubmitting
					? `Creating ${submittedSandwichType} Sandwich`
					: `Create Sandwich`}
			</button>
		</Form>
	)
}
```

<TouchedFiles>
  <div id="files">
    <ul>
      <li data-state="modified">
        <span>modified</span>

        <InlineFile file="app/routes/settings+/profile.tsx" />
      </li>
    </ul>

  </div>
</TouchedFiles>
