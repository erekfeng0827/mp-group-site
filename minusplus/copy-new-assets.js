const fs = require('fs');
const path = require('path');
const vm = require('vm');
const dataPath = path.join('assets','portfolio','portfolio-data.js');
const src = fs.readFileSync(dataPath, 'utf8');
const ctx = {};
vm.createContext(ctx);
const portfolio = JSON.parse(vm.runInContext(src + '; JSON.stringify(PORTFOLIO);', ctx));
const root = path.join('assets','portfolio');
let actions = [];
for (const project of portfolio) {
  const slug = project.slug;
  const dir = path.join(root, slug);
  const newDir = path.join(dir, 'new');
  if (!fs.existsSync(newDir)) continue;
  const files = fs.readdirSync(newDir).filter(f => fs.statSync(path.join(newDir, f)).isFile());
  for (const file of files) {
    if (file.endsWith('.crdownload') || file === '下載.png') continue;
    const srcFile = path.join(newDir, file);
    const destFile = path.join(dir, file);
    const shouldCopy =
      file === project.cover ||
      project.images.includes(file) ||
      file.toLowerCase().startsWith('cover.') ||
      fs.existsSync(destFile);
    if (shouldCopy) {
      fs.copyFileSync(srcFile, destFile);
      actions.push({slug, file, action: 'copied'});
    }
  }
}
console.log(JSON.stringify(actions, null, 2));
