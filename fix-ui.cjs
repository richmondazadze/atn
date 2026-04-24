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
    let changed = false;

    // 1. Replace generic spinner with LoadingSpinner
    const spinnerRegex = /<div className="h-[68]\sw-[68]\sanimate-spin\srounded-full\sborder-[24]\sborder-primary\sborder-t-transparent"\s*\/>/g;
    const alternateSpinner = /<div className="h-5 w-5 animate-spin rounded-full border-2 border-[a-z\-]+ border-t-transparent" \/>/g;
    
    // We will just replace common patterns
    if (content.match(/animate-spin.*border-t-transparent/)) {
        content = content.replace(/<div className="h-[0-9]+ w-[0-9]+ animate-spin rounded-full border-[0-9]+ border-[a-z\-]+ border-t-transparent"\s*\/>/g, '<LoadingSpinner />');
        
        // Ensure import exists
        if (!content.includes('LoadingSpinner')) {
            // Find appropriate import path
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
        }
        changed = true;
    }

    // 2. Remove top badges like <Badge>Admin</Badge> or <span className="label-pill">...</span>
    if (content.includes('label-pill')) {
        content = content.replace(/<span className="label-pill">[^<]+<\/span>/g, '');
        changed = true;
    }

    // 3. Card color consistency
    if (content.includes('bg-surface-') || content.includes('bg-secondary') || content.includes('bg-white')) {
        // Strip out specific background classes from Card usage, but this can be dangerous if applied blindly.
        // The user specifically mentioned dashboards. Let's strip bg-secondary from main wrappers.
        content = content.replace(/className="([^"]*)bg-secondary([^"]*)"/g, 'className="$1bg-background$2"');
        content = content.replace(/className="([^"]*)bg-surface-teal([^"]*)"/g, 'className="$1$2"');
        content = content.replace(/className="([^"]*)bg-white([^"]*)"/g, 'className="$1$2"');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
    }
});
