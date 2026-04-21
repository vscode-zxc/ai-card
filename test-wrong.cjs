const {chromium} = require('playwright');
(async function() {
  const b = await chromium.launch({headless:true});
  const p = await b.newPage();
  await p.setViewportSize({width: 390, height: 844});
  await p.goto('http://localhost:5175/', {waitUntil:'networkidle', timeout:15000});

  await p.evaluate(function() {
    var req = indexedDB.open('ai-card-db', 1);
    req.onsuccess = function() {
      var db = req.result;
      var tx = db.transaction('questions', 'readwrite');
      var store = tx.objectStore('questions');
      var img = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
      // Q1: correct answer is index 0
      store.put({id:'q1',createdAt:1,isMarked:false,question:'请选择「黄色的猫咪」？',answer:'黄色的猫咪',items:[{word:'猫咪',colorName:'黄色',colorValue:'#FFD54F'},{word:'袜子',colorName:'白色',colorValue:'#F5F5F5'},{word:'公交',colorName:'蓝色',colorValue:'#64B5F6'},{word:'房子',colorName:'绿色',colorValue:'#81C784'}],correctIndex:0,answered:false,gridImageBase64:img});
    };
  });

  await p.click('text=题目回顾');
  await p.waitForTimeout(800);

  // Select wrong answer (index 1 = white sock, which is wrong)
  var cells = await p.locator('.qi-cell').all();
  console.log('Cells found:', cells.length);
  await cells[1].click(); // wrong answer
  await p.waitForTimeout(400);

  var state1 = await p.evaluate(function() {
    return {
      hasErrorModal: !!document.querySelector('.overlay-error'),
      hasSuccessModal: !!document.querySelector('.overlay-success'),
      errorTitle: document.querySelector('.error-title') ? document.querySelector('.error-title').textContent : null,
      nextDisabled: document.querySelector('.bar-btn-next') ? document.querySelector('.bar-btn-next').disabled : null,
    };
  });
  console.log('After wrong answer:', JSON.stringify(state1));

  // Wait for error modal to close (2s)
  await p.waitForTimeout(2500);

  // Try to select correct answer
  await cells[0].click();
  await p.waitForTimeout(600);

  var state2 = await p.evaluate(function() {
    return {
      hasModal: !!document.querySelector('.modal-overlay'),
      hasSelected: !!document.querySelector('.qi-selected'),
      selectedIndex: document.querySelector('.qi-selected') ? Array.from(document.querySelectorAll('.qi-cell')).indexOf(document.querySelector('.qi-selected')) : null,
    };
  });
  console.log('After clicking correct (should work):', JSON.stringify(state2));

  await b.close();
  console.log('DONE');
})().catch(function(e){ console.error('FAIL:', e.message); process.exit(1); });
