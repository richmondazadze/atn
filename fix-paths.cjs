const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/app/pages');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.tsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk(pagesDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find incorrect imports
    const depth = file.split(path.sep).length - pagesDir.split(path.sep).length; // 2 for public/File.tsx
    // The correct number of ../ is depth. (1 for public/ -> ../, 2 for public/sub/ -> ../../)
    // Wait, src/app/pages/public/File.tsx -> to src/app/components is ../../components
    // Since depth=2 (public, File.tsx), we need depth times '../' which is 2.
    // My previous script used depth + 1 = 3!
    
    const wrongDirs = '../'.repeat(depth + 1);
    const correctDirs = '../'.repeat(depth);
    
    if (content.includes(`import { LoadingSpinner } from '${wrongDirs}components/LoadingSpinner';`)) {
        content = content.replace(
            `import { LoadingSpinner } from '${wrongDirs}components/LoadingSpinner';`,
            `import { LoadingSpinner } from '${correctDirs}components/LoadingSpinner';`
        );
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed path in:', file);
    }
});
