import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { join } from 'path';

async function formatSvelteCSS() {
	try {
		const files = globSync('src/lib/components/shared/**/*.svelte', {
			ignore: ['node_modules/**', 'dist/**', 'build/**'],
			nodir: true,
		});

		for (const file of files) {
			try {
				const filePath = join(process.cwd(), file);
				let content = readFileSync(filePath, 'utf8');

				content = content.replace(/(\n*)(<!--\s*prettier-ignore\s*-->)?\s*(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, existingNewlines, existingIgnore, openingTag, cssContent, closingTag) => {
					const processedCSS = processCSSContent(cssContent);

					const needsIgnore = !existingIgnore;
					const newline = existingNewlines.includes('\n') ? '' : '\n';

					let output = needsIgnore ? `${newline}<!-- prettier-ignore -->\n${openingTag}\n${processedCSS}\n${closingTag}` : `${existingNewlines}${existingIgnore}\n${openingTag}\n${processedCSS}\n${closingTag}`;

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
	// Process nested blocks first (media queries, keyframes, etc.)
	const processed = css.replace(/(@[^{]+\{)([\s\S]+?)(?=\})/g, (match, atRuleStart, content) => {
		// Process the nested content while preserving the structure
		const processedContent = content.replace(/([^{]+\{)([^}]+)(\})/g, (_, selector, declarations, close) => {
			const formattedDeclarations = declarations
				.replace(/\s*:\s*/g, ': ')
				.replace(/\s*;\s*/g, '; ')
				.replace(/\s+/g, ' ')
				.trim()
				.replace(/; $/, '');

			return `${selector}${formattedDeclarations}${close}`;
		});

		return `${atRuleStart}${processedContent}`;
	});

	// Then process top-level rules
	return processed.replace(/([^{]+\{)([^}]+)(\})/g, (_, selector, declarations, close) => {
		const formattedDeclarations = declarations
			.replace(/\s*:\s*/g, ': ')
			.replace(/\s*;\s*/g, '; ')
			.replace(/\s+/g, ' ')
			.trim()
			.replace(/; $/, '');

		return `${selector}${formattedDeclarations}${close}`;
	});
}

formatSvelteCSS().catch(console.error);
