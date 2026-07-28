const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const replaceRules = [
    { from: /bg-\[#1a1a1a\]/g, to: 'bg-white/70 backdrop-blur-md' },
    { from: /bg-\[#0f0f0f\]/g, to: 'bg-[#f4f3f1]/80' },
    { from: /bg-\[#252525\]/g, to: 'bg-white/50' },
    { from: /bg-\[#2a2a2a\]/g, to: 'bg-white/60' },
    { from: /border-gray-800/g, to: 'border-white/80 shadow-lg shadow-black/5' },
    { from: /border-gray-700/g, to: 'border-white/60' },
    { from: /text-white/g, to: 'text-[#1a1c1a]' },
    { from: /text-gray-200/g, to: 'text-[#1a1c1a]' },
    { from: /text-gray-300/g, to: 'text-[#4b463e]' },
    { from: /text-gray-400/g, to: 'text-[#7c766d]' },
    { from: /text-gray-500/g, to: 'text-[#7c766d]' },
    { from: /divide-gray-800/g, to: 'divide-[#cdc6ba]/20' },
    { from: /text-blue-400/g, to: 'text-blue-600' },
    { from: /bg-blue-400\/10/g, to: 'bg-blue-600/10' },
    { from: /text-orange-400/g, to: 'text-orange-600' },
    { from: /bg-orange-400\/10/g, to: 'bg-orange-600/10' },
    { from: /text-green-400/g, to: 'text-green-600' },
    { from: /bg-green-400\/10/g, to: 'bg-green-600/10' },
    { from: /bg-gray-500\/10/g, to: 'bg-gray-600/10' },
    { from: /border-gray-500\/20/g, to: 'border-gray-600/20' },
    { from: /text-primary/g, to: 'text-[#775a19]' },
    { from: /bg-primary/g, to: 'bg-[#775a19]' },
    { from: /hover:text-primary-dark/g, to: 'hover:text-[#5d4201]' },
    { from: /hover:bg-primary-dark/g, to: 'hover:bg-[#5d4201]' },
    { from: /ring-primary/g, to: 'ring-[#775a19]' },
    { from: /border-primary/g, to: 'border-[#775a19]' },
    { from: /ring-offset-\[#0f0f0f\]/g, to: 'ring-offset-white' },
];

function refactorFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const rule of replaceRules) {
        content = content.replace(rule.from, rule.to);
    }
    // Also set specific font class for body/headings
    // "font-serif text-[#1a1c1a]" instead of "font-serif text-[#1a1c1a]" (if already matched)
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Refactored ${filePath}`);
}

const files = fs.readdirSync(pagesDir);
for (const file of files) {
    if (file.endsWith('.jsx') && file !== 'LoginPage.jsx') { // LoginPage was already modified
        refactorFile(path.join(pagesDir, file));
    }
}
