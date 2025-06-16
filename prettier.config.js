module.exports = {
	...require('./.prettierrc'),
	plugins: [
		{
			parsers: {
				css: {
					parse(text, parsers, options) {
						const ast = parsers.css(text, parsers, options);

						// Modify AST to force single-line rules
						if (ast.stylesheet?.rules) {
							ast.stylesheet.rules.forEach((rule) => {
								if (rule.type === 'rule') {
									rule.declarations.forEach((decl) => {
										decl.raws.before = ' ';
										decl.raws.after = '';
										decl.raws.between = ': ';
									});
									rule.raws.after = ' ';
									rule.raws.between = ' ';
									rule.raws.semicolon = false;
								}
							});
						}
						return ast;
					},
				},
			},
		},
		'prettier-plugin-svelte',
	],
};
