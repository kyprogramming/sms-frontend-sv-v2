import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { join } from 'path';

function formatCSSInSvelteFiles() {
	const files = globSync('**/*.svelte', { ignore: 'node_modules/**' });

	files.forEach((file) => {
		const filePath = join(process.cwd(), file);
		let content = readFileSync(filePath, 'utf8');

		content = content.replace(/(<style(?:[^>]*)>)([\s\S]*?)(<\/style>)/gi, (match, openingTag, css, closingTag) => {
			// Ensure lang attribute exists
			const processedOpeningTag = openingTag.includes('lang=') ? openingTag : openingTag.replace('<style', '<style lang="css"');

			// Check for existing ignore comments
			const hasIgnore = css.includes('<!-- prettier-ignore-start -->');

			// Format CSS content
			let formattedCSS = css.replace(/<!-- prettier-ignore-start -->|<!-- prettier-ignore-end -->/g, '').trim();

			// Skip processing if empty
			if (!formattedCSS) return `${processedOpeningTag}${closingTag}`;

			// Fix malformed keyframes
			formattedCSS = formattedCSS.replace(/@keyframes\s+([^{]+)\s*{([^}]*)}/g, (match, name, content) => {
				return `@keyframes ${name.trim()} {${content.replace(/(from|to)([^{]*{)/g, '$1 $2')}}`;
			});

			// Add ignore comments back if they existed
			if (hasIgnore) {
				formattedCSS = `<!-- prettier-ignore-start -->\n${formattedCSS}\n<!-- prettier-ignore-end -->`;
			}

			return `${processedOpeningTag}\n${formattedCSS}\n${closingTag}`;
		});

		writeFileSync(filePath, content);
	});
}

formatCSSInSvelteFiles();
// import { readFileSync, writeFileSync } from 'fs';
// import { globSync } from 'glob';
// import { join } from 'path';

// function formatCSSInSvelteFiles() {
// 	const files = globSync('**/*.svelte', { ignore: 'node_modules/**' });

// 	files.forEach((file) => {
// 		const filePath = join(process.cwd(), file);
// 		let content = readFileSync(filePath, 'utf8');

// 		content = content.replace(/<style>([\s\S]*?)<\/style>/g, (match, css) => {
// 			// Process ALL CSS rules (including IDs, elements, and attribute selectors)
// 			const formattedCSS = css.replace(/([^{]+{)([\s\S]*?)}/g, (fullMatch, selector, declarations) => {
// 				return `${selector}${declarations.replace(/[\r\n\s]+/g, ' ').trim()} }`;
// 			});
// 			return `<style>${formattedCSS}</style>`;
// 		});

// 		writeFileSync(filePath, content);
// 	});
// }

// formatCSSInSvelteFiles();
