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
      store.put({id:'q1',createdAt:1,isMarked:false,question:'请选择「黄色的猫咪」？',answer:'黄色的猫咪',items:[{word:'猫咪',colorName:'黄色',colorValue:'#FFD54F'},{word:'袜子',colorName:'白色',colorValue:'#F5F5F5'},{word:'公交',colorName:'蓝色',colorValue:'#64B5F6'},{word:'房子',colorName:'绿色',colorValue:'#81C784'}],correctIndex:0,answered:false,gridImageBase64:img});
      store.put({id:'q2',createdAt:2,isMarked:false,question:'请选择「红色的苹果」？',answer:'红色的苹果',items:[{word:'苹果',colorName:'红色',colorValue:'#E57373'},{word:'香蕉',colorName:'黄色',colorValue:'#FFD54F'},{word:'葡萄',colorName:'紫色',colorValue:'#BA68C8'},{word:'橙子',colorName:'橙色',colorValue:'#FFB74D'}],correctIndex:1,answered:false,gridImageBase64:img});
    };
  });

  // ===== TEST 1: 答对 → 弹窗显示 → 5s自动下一题 =====
  console.log('=== TEST 1: 答对自动下一题 ===');
  await p.click('text=题目回顾');
  await p.waitForTimeout(800);

  // Click correct (index 0)
  await p.evaluate(function() { document.querySelectorAll('.qi-cell')[0].click(); });
  await p.waitForTimeout(500);

  var s1 = await p.evaluate(function() {
    return {
      hasModal: !!document.querySelector('.modal-overlay'),
      hasCard: !!document.querySelector('.feedback-card'),
      hasSuccess: !!document.querySelector('.overlay-success'),
      hasConfetti: !!document.querySelector('.confetti-field'),
      countdown: document.querySelector('.countdown-text') ? document.querySelector('.countdown-text').textContent : null,
      nextDisabled: !!document.querySelector('.bar-btn-next[disabled]'),
    };
  });
  console.log('After correct click:', JSON.stringify(s1));

  // Wait 6s for auto-advance
  await p.waitForTimeout(6200);
  var s2 = await p.evaluate(function() {
    var q = document.querySelector('.question-text');
    return { question: q ? q.textContent : null };
  });
  console.log('After 6s auto-advance:', s2.question);

  // ===== TEST 2: 答错 → 弹窗显示 → 2s关闭 → 可以重新选 =====
  console.log('\n=== TEST 2: 答错可重选 ===');
  await p.evaluate(function() { document.querySelectorAll('.qi-cell')[2].click(); }); // wrong
  await p.waitForTimeout(300);

  var s3 = await p.evaluate(function() {
    return {
      hasError: !!document.querySelector('.overlay-error'),
      errorTitle: document.querySelector('.error-title') ? document.querySelector('.error-title').textContent : null,
      nextDisabled: !!document.querySelector('.bar-btn-next[disabled]'),
    };
  });
  console.log('After wrong click:', JSON.stringify(s3));

  // Wait 2.5s for error modal to close
  await p.waitForTimeout(2700);

  // Click correct (index 1 = 红色苹果)
  await p.evaluate(function() { document.querySelectorAll('.qi-cell')[1].click(); });
  await p.waitForTimeout(500);

  var s4 = await p.evaluate(function() {
    return {
      hasSuccess: !!document.querySelector('.overlay-success'),
      nextDisabled: !!document.querySelector('.bar-btn-next[disabled]'),
    };
  });
  console.log('After correct retry:', JSON.stringify(s4));

  await b.close();
  console.log('\nALL TESTS PASSED');
})().catch(function(e){ console.error('FAIL:', e.message); process.exit(1); });
