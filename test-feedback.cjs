const {chromium} = require('playwright');
(async function() {
  const b = await chromium.launch({headless:true});
  const p = await b.newPage();
  var logs = [];
  p.on('console', function(m) { logs.push('[' + m.type() + '] ' + m.text()); });
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

  await p.click('text=题目回顾');
  await p.waitForTimeout(800);

  // Use JS click to trigger the event
  await p.evaluate(function() {
    var cells = document.querySelectorAll('.qi-cell');
    console.log('Clicking cell, selectedIndex was:', cells[0] ? 'found' : 'not found');
    if (cells[0]) cells[0].click();
  });
  await p.waitForTimeout(500);

  var state1 = await p.evaluate(function() {
    var selected = document.querySelector('.qi-selected');
    var modal = document.querySelector('.modal-overlay');
    var card = document.querySelector('.feedback-card');
    var success = document.querySelector('.overlay-success');
    var confetti = document.querySelector('.confetti-field');
    return {
      hasSelected: !!selected,
      hasModal: !!modal,
      hasCard: !!card,
      hasSuccess: !!success,
      hasConfetti: !!confetti,
      selectedClass: selected ? selected.className : null,
      modalZ: modal ? window.getComputedStyle(modal).zIndex : null,
    };
  });
  console.log('After correct click:', JSON.stringify(state1, null, 2));
  console.log('Logs:', logs.slice(-10).join('\n'));

  // Wait for auto-advance (5s + buffer)
  await p.waitForTimeout(5500);

  var state2 = await p.evaluate(function() {
    var q = document.querySelector('.question-text');
    return { question: q ? q.textContent : null };
  });
  console.log('After auto-advance:', state2.question);

  await b.close();
})().catch(function(e){ console.error('FAIL:', e.message); process.exit(1); });
