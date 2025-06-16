import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { join } from 'path';

async function formatSvelteCSS() {
	try {
		const files = globSync('src/lib/components/layouts/*.svelte', {
			ignore: ['node_modules/**', 'dist/**', 'build/**'],
			nodir: true,
		});

		for (const file of files) {
			try {
				const filePath = join(process.cwd(), file);
				let content = readFileSync(filePath, 'utf8');

				content = content.replace(/(\n*)(<!--\s*prettier-ignore\s*-->)?\s*(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, existingNewlines, existingIgnore, openingTag, cssContent, closingTag) => {
					const processedCSS = processCSSContent(cssContent);

					// Determine if we need to add ignore comment
					const needsIgnore = !existingIgnore;

					// Ensure exactly one newline before ignore comment
					const newline = existingNewlines.includes('\n') ? '' : '\n';

					// Build the output
					let output = '';
					if (needsIgnore) {
						output = `${newline}<!-- prettier-ignore -->\n${openingTag}\n${processedCSS}\n${closingTag}`;
					} else {
						output = `${existingNewlines}${existingIgnore}\n${openingTag}\n${processedCSS}\n${closingTag}`;
					}

					return output;
				});

				writeFileSync(filePath, content);
				console.log(`✅ Processed: ${file}`);
			} catch (fileError) {
				console.error(`⚠️ Error processing ${file}:`, fileError.message);
			}
		}
		console.log('🎉 CSS formatting complete!');
	} catch (error) {
		console.error('❌ Critical error:', error.message);
		process.exit(1);
	}
}

function processCSSContent(css) {
	return css
		.trim()
		.split('}')
		.map((rule) => {
			const [selector = '', declarations = ''] = rule.split('{');
			const cleanSelector = selector.trim();
			const cleanDeclarations = declarations.trim();

			if (!cleanSelector || !cleanDeclarations) return null;

			const formattedDeclarations = cleanDeclarations
				.replace(/\s*:\s*/g, ': ')
				.replace(/\s*;\s*/g, '; ')
				.replace(/\s+/g, ' ')
				.trim()
				.replace(/; $/, '');

			return `\t${cleanSelector} { ${formattedDeclarations} }`;
		})
		.filter(Boolean)
		.join('\n');
}

formatSvelteCSS().catch(console.error);
