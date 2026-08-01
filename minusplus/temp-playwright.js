const { chromium } = require('playwright');
(async ()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs=[];
  page.on('console', msg => logs.push({type: msg.type(), text: msg.text()}));
  page.on('pageerror', err => logs.push({type:'pageerror', text:err.message}));
  await page.goto('http://127.0.0.1:8000/minusplus/portfolio.html', { waitUntil: 'load' });
  const bodyHtml = await page.$eval('body', el => el.innerHTML.slice(0,500));
  const gridHtml = await page.$eval('#portfolioGrid', el => el.innerHTML);
  console.log('logs:', JSON.stringify(logs, null, 2));
  console.log('bodyLength', bodyHtml.length);
  console.log('gridInnerLength', gridHtml.length);
  console.log('gridInnerSnippet', gridHtml.slice(0,300));
  await browser.close();
})();
