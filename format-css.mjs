import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { join } from 'path';

async function formatSvelteCSS() {
	try {
		const files = globSync('**/FeeHeadList.svelte', {
			ignore: ['node_modules/**', 'dist/**', 'build/**'],
			nodir: true,
		});

		for (const file of files) {
			try {
				const filePath = join(process.cwd(), file);
				let content = readFileSync(filePath, 'utf8');

				content = content.replace(
					/(<style([^>]*)>)([\s\S]*?)(<\/style>)/gi,
					(_, openingTag, attrs, css, closingTag) => {
						const normalizedOpening = `<style${attrs}>`;
						const hasIgnore = css.includes('prettier-ignore');
						const cleanCSS = removeIgnoreComments(css).trim();

						if (!cleanCSS) return `${normalizedOpening}${closingTag}`;

						const formattedCSS = formatEachRuleToSingleLine(cleanCSS);

						return reconstructStyleBlock({
							openingTag: normalizedOpening,
							css: formattedCSS,
							closingTag,
							hasIgnore,
						});
					},
				);

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

function removeIgnoreComments(css) {
	return typeof css === 'string'
		? css.replace(/<!--\s*prettier-ignore-(start|end)\s*-->/g, '')
		: '';
}

function formatEachRuleToSingleLine(css) {
	return css
		.split('}')
		.map((rule) => {
			const [selector = '', declarations = ''] = rule.split('{');
			const cleanSelector = selector.trim();
			const cleanDeclarations = declarations.trim();

			if (!cleanSelector || !cleanDeclarations) return null;

			// Format declarations with one space after each property
			const singleLineDeclarations = cleanDeclarations
				.replace(/[\r\n]+/g, ' ') // Remove newlines
				.replace(/\s+/g, ' ') // Collapse multiple spaces
				.replace(/([^:]+):\s*/g, '$1: ') // Ensure one space after colon
				.replace(/;\s*/g, '; ') // Ensure one space after semicolon
				.trim()
				.replace(/; $/, ';'); // Remove trailing space if last char is semicolon

			return `\t${cleanSelector} { ${singleLineDeclarations} }`;
		})
		.filter(Boolean)
		.join('\n');
}

function reconstructStyleBlock({ openingTag, css, closingTag, hasIgnore }) {
	const content = hasIgnore
		? `\n<!-- prettier-ignore-start -->\n${css}\n<!-- prettier-ignore-end -->\n`
		: `\n${css}\n`;

	return `${openingTag}${content}${closingTag}`;
}

formatSvelteCSS().catch(console.error);
