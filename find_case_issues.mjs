import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';

const srcDir = 'c:/Users/jcurruchiche/Desktop/VACAS/control-de-vacaciones-API/src';

function getAllJsFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules') continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...getAllJsFiles(full));
    } else if (entry.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = getAllJsFiles(srcDir);

for (const file of allFiles) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/from\s+["']([^"']+)["']/);
    if (!match) continue;
    const importPath = match[1];
    if (!importPath.startsWith('.')) continue;
    
    const resolvedPath = resolve(dirname(file), importPath);
    
    // On Windows, existsSync is case-insensitive, so we need to check actual case
    // Check each segment of the path
    const parts = resolvedPath.replace(/\\/g, '/').split('/');
    let currentPath = parts[0]; // drive letter
    let caseMismatch = false;
    
    for (let j = 1; j < parts.length; j++) {
      const expectedPart = parts[j];
      const parentDir = currentPath;
      
      if (!existsSync(parentDir)) {
        caseMismatch = true;
        break;
      }
      
      try {
        const actualEntries = readdirSync(parentDir);
        const actualEntry = actualEntries.find(e => e.toLowerCase() === expectedPart.toLowerCase());
        
        if (!actualEntry) {
          caseMismatch = true;
          console.log(`MISSING: ${file}:${i+1}`);
          console.log(`  Import: ${importPath}`);
          console.log(`  Missing segment: ${expectedPart} in ${parentDir}`);
          console.log('');
          break;
        }
        
        if (actualEntry !== expectedPart) {
          console.log(`CASE MISMATCH: ${file}:${i+1}`);
          console.log(`  Import: ${importPath}`);
          console.log(`  Expected: ${expectedPart}`);
          console.log(`  Actual:   ${actualEntry}`);
          console.log('');
          caseMismatch = true;
          break;
        }
        
        currentPath = join(parentDir, actualEntry);
      } catch(e) {
        break;
      }
    }
  }
}

console.log('Scan complete.');
