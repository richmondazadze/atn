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
    
    // Check if the file uses <LoadingSpinner but does NOT import LoadingSpinner
    if (content.includes('<LoadingSpinner') && !content.includes('import { LoadingSpinner }')) {
        const depth = file.split(path.sep).length - pagesDir.split(path.sep).length;
        const upDirs = '../'.repeat(depth + 1);
        const importStmt = `import { LoadingSpinner } from '${upDirs}components/LoadingSpinner';\n`;
        
        // Add after the last import
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfImport = content.indexOf('\n', lastImportIndex);
            content = content.substring(0, endOfImport + 1) + importStmt + content.substring(endOfImport + 1);
        } else {
            content = importStmt + content;
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed import in:', file);
    }
});
