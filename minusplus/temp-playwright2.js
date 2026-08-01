const { chromium } = require('playwright');
(async ()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const requests = [];
  page.on('requestfinished', async req => {
    const resp = await req.response();
    if (resp && resp.status() >= 400) {
      requests.push({url:req.url(), status: resp.status(), resourceType: req.resourceType()});
    }
  });
  page.on('requestfailed', req => {
    requests.push({url:req.url(), status:'failed', resourceType:req.resourceType(), failureText:req.failure()?.errorText});
  });
  await page.goto('http://127.0.0.1:8000/minusplus/portfolio.html', { waitUntil: 'load' });
  console.log(JSON.stringify(requests, null, 2));
  await browser.close();
})();
