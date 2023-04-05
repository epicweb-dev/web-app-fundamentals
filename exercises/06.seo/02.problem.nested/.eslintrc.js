/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
	extends: [
		'@remix-run/eslint-config',
		'@remix-run/eslint-config/node',
		'prettier',
	],
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports',
				disallowTypeAnnotations: true,
				fixStyle: 'inline-type-imports',
			},
		],
		'@typescript-eslint/no-duplicate-imports': 'warn',
	},
}
