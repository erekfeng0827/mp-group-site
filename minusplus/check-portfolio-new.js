const fs = require('fs'); const path = require('path');
const dataPath = path.join('assets','portfolio','portfolio-data.js');
const src = fs.readFileSync(dataPath, 'utf8');
const vm = require('vm');
const ctx = {};
vm.createContext(ctx);
const result = vm.runInContext(src + '; JSON.stringify(PORTFOLIO);', ctx);
const portfolio = JSON.parse(result);
function exists(fn){return fs.existsSync(fn);} 
const root = path.join('assets','portfolio');
const diffs=[];
for(const project of portfolio){
  const slug=project.slug;
  const dir=path.join(root,slug);
  const newDir=path.join(dir,'new');
  if(!fs.existsSync(newDir)) continue;
  const files = fs.readdirSync(newDir).filter(f=>fs.statSync(path.join(newDir,f)).isFile());
  const coverFiles = files.filter(f=>/^cover\./i.test(f));
  const result={slug, coverInData: project.cover, coverFiles, missingInRoot: [], extraNew: files};
  if(project.cover){ if(!exists(path.join(dir, project.cover))) result.missingInRoot.push(project.cover); }
  const imageFiles = project.images || [];
  for(const img of imageFiles){ if(!exists(path.join(dir,img))){ result.missingInRoot.push(img);} }
  diffs.push(result);
}
console.log(JSON.stringify(diffs, null, 2));
