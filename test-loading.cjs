const {chromium} = require('playwright');
(async()=>{
  const b = await chromium.launch({headless:true});
  const p = await b.newPage();
  await p.setViewportSize({width: 390, height: 844});
  await p.goto('http://localhost:5175/', {waitUntil:'networkidle', timeout:15000});
  await p.evaluate(() => localStorage.setItem('minimax_api_key', 'test'));
  await p.click('text=开始游戏');
  await p.waitForTimeout(200);
  await p.click('.modal-card .btn-primary');
  await p.waitForTimeout(50);

  const allClasses = await p.evaluate(() => {
    const els = document.querySelectorAll('[class]');
    return Array.from(els).slice(0, 30).map(function(e){ return e.className; });
  });
  console.log('All classes:', JSON.stringify(allClasses, null, 2));

  const loadingHTML = await p.evaluate(() => {
    const el = document.querySelector('.loading-page');
    return el ? el.innerHTML.substring(0, 800) : 'NOT FOUND';
  });
  console.log('Loading HTML:', loadingHTML);

  await b.close();
})().catch(function(e){ console.error('FAIL:', e.message); process.exit(1); });
