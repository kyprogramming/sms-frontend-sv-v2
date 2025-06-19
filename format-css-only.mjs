import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { join } from 'path';

async function formatCSSFiles() {
	try {
		const files = globSync('src/**/*.css', {
			ignore: ['node_modules/**', 'dist/**', 'build/**'],
			nodir: true,
		});

		for (const file of files) {
			try {
				const filePath = join(process.cwd(), file);
				let content = readFileSync(filePath, 'utf8');
				content = processCSSContent(content);
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
	// Remove leading/trailing whitespace and normalize line breaks
	css = css.trim().replace(/\r\n/g, '\n');

	// Process nested blocks (e.g., @media, @keyframes)
	css = css.replace(/(@[^{]+\{)([\s\S]+?})(\s*)}/g, (_, atRuleStart, innerBlock) => {
		const processedInner = innerBlock.replace(/([^{]+\{)([^}]+)(\})/g, (_, selector, declarations, close) => {
			const formatted = declarations
				.replace(/\s*:\s*/g, ': ')
				.replace(/\s*;\s*/g, '; ')
				.replace(/\s+/g, ' ')
				.trim()
				.replace(/;$/, ''); // remove last semicolon if exists

			return `${selector}${formatted}${close}`;
		});
		return `${atRuleStart}${processedInner}\n}`;
	});

	// Format top-level rules (including :root, ::after, etc.)
	css = css.replace(/([^{]+\{)([^}]+)(\})/g, (_, selector, declarations, close) => {
		const formatted = declarations
			.replace(/\s*:\s*/g, ': ')
			.replace(/\s*;\s*/g, '; ')
			.replace(/\s+/g, ' ')
			.trim()
			.replace(/;$/, '');

		return `${selector}${formatted}${close}`;
	});

	// Remove multiple blank lines between rules
	css = css.replace(/\}\s*\n\s*\n+/g, '}\n');

	// Add a single line break between each rule
	css = css.replace(/\}([^\n])/g, '}\n$1');

	return css.trim();
}

formatCSSFiles().catch(console.error);
