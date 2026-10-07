const fs = require('fs');

const tsxPath = 'src/modules/landing/presentation/pages/LandingPage.tsx';
let tsx = fs.readFileSync(tsxPath, 'utf8');

// Find all src="assets/..."
const regex = /src="assets\/([^"]+\.(png|jpg|svg))"/g;
let match;
const imports = new Set();
const replacements = [];

while ((match = regex.exec(tsx)) !== null) {
    const filename = match[1];
    const importName = filename.replace(/[^a-zA-Z0-9]/g, '') + 'Img';
    imports.add(`import ${importName} from '../../../../assets/${filename}';`);
    replacements.push({
        orig: match[0],
        new: `src={${importName}}`
    });
}

// Ensure unique replacements
const uniqueReplacements = [...new Set(replacements.map(r => JSON.stringify(r)))].map(r => JSON.parse(r));

uniqueReplacements.forEach(r => {
    tsx = tsx.replaceAll(r.orig, r.new);
});

// Add imports after the last import
const importStr = Array.from(imports).join('\n');
tsx = tsx.replace(/(import .*;\n)+/, (match) => {
    return match + importStr + '\n';
});

fs.writeFileSync(tsxPath, tsx);
console.log('Fixed image imports in LandingPage.tsx');
