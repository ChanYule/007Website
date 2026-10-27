// Optional browser regression: set PLAYWRIGHT_MODULE to an installed playwright or playwright-core module.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
 const browser = await chromium.launch({ headless: true });
 let checks = 0;
 const check = (value, message) => { assert.ok(value, message); checks++; };
 try {
  const page = await browser.newPage();
  const errors = []; const missing = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if(response.url().startsWith('http://127.0.0.1:8000/') && response.status() >= 400) missing.push(response.url()); });
  await page.goto('http://127.0.0.1:8000');
  await page.waitForTimeout(1000);
  await page.evaluate(() => { localStorage.setItem('cb_agent', 'zip-lip'); localStorage.setItem('cb_votes', '{"0":true}'); localStorage.setItem('cb_ideas', JSON.stringify([{title:'Existing family idea',description:'Keep this',votes:3}])); localStorage.setItem('unrelated-data','preserve'); });
  await page.reload(); await page.waitForFunction(() => getComputedStyle(document.querySelector("#loadingScreen")).visibility === "hidden");
  check(await page.locator('.activity-card').count() === 8, 'two programmes and six original activities');
  check(await page.locator('[data-select-agent="zip-lip"]').textContent() === 'Selected', 'saved agent restored');
  check(await page.locator('.vote-button').getAttribute('class').then(value=>value.includes('voted')), 'saved vote restored');
  for(const [title, id, dates, phone, address] of [
   ['Memories Meet Digital','memories-meet-digital',8,'8687 0039','230A Bukit Batok Street 21'],
   ['Travelling without Borders','travelling-without-borders',7,'6347 2801','212 Bukit Batok Street 21']]) {
   await page.locator('#activitySearch').fill(title);
   check(await page.locator('.activity-card').count() === 1, 'search finds only selected programme');
   check(await page.locator('.programme-art img').evaluate(e=>e.complete&&e.naturalWidth>0), 'programme image loads');
   check(await page.locator('.fit-meter').count() === 0, 'no invented fit scores');
   await page.locator(`[data-programme="${id}"]`).click();
   check(await page.locator('#activityModalTitle').textContent() === title, 'correct details');
   await page.locator('.programme-detail-image').evaluate(image => image.decode());
   check(await page.locator('.programme-detail-image').evaluate(image => image.naturalWidth === 768 && image.naturalHeight === 2048), 'original full-resolution poster loads');
   check(await page.locator('.programme-detail-image').evaluate(image => getComputedStyle(image).objectFit === 'contain'), 'details poster is uncropped');
   const posterLink = page.locator('.programme-poster-link');
   check(await posterLink.getAttribute('href') === await page.locator('.programme-art img').getAttribute('src'), 'full poster link matches selected programme');
   const [posterTab] = await Promise.all([page.waitForEvent('popup'), posterLink.click()]);
   await posterTab.waitForLoadState('load');
   check(await posterTab.locator('img').evaluate(image => image.complete && image.naturalWidth === 768 && image.naturalHeight === 2048), 'full poster opens original image in new tab');
   await posterTab.close();

   check(await page.locator('.programme-date-list li').count() === dates, 'all advertised dates shown');
   const content = await page.locator('#activityModalContent').textContent();
   for(const detail of [phone,address,'1:30 PM to 3:30 PM','FREE','Maximum 4 family dyads']) check(content.includes(detail),`detail ${detail}`);
   check(!content.includes('1:00 PM') && !content.includes('8 left'), 'no generic time selector');
   await page.locator('[data-programme-dates]').click();
   check(await page.locator('#programmeSession').evaluate(e=>e===document.activeElement), 'shortcut focuses dates');
   const firstDate = await page.locator('#programmeSession option').nth(1).getAttribute('value');
   await page.locator('#programmeSession').selectOption(firstDate);
   await page.locator('#programmeDyads').selectOption('2');
   const summary = await page.locator('#programmeBookingSummary').textContent();
   check(summary.includes(title)&&summary.includes('2 family dyads (4 people)')&&summary.includes(address)&&summary.includes('1:30 PM to 3:30 PM'), 'correct telephone summary');
   check(await page.locator('.programme-call').getAttribute('href') === (id==='memories-meet-digital'?'tel:+6586870039':'tel:+6563472801'), 'official telephone action');
   await page.locator('#programmeDyads').evaluate(e=>{e.value='';e.dispatchEvent(new Event('change'));});
   check((await page.locator('#programmeBookingSummary').textContent()).includes('Choose an available session'), 'invalid dyad count rejected');
   await page.locator('#programmeSession').selectOption('');
   check(!(await page.locator('#programmeBookingSummary').textContent()).includes('Booking awaiting'), 'empty session produces no booking summary');
   await page.locator('.modal-close').focus(); await page.keyboard.press('Shift+Tab');
   check(await page.locator('.programme-contact').evaluate(e=>e===document.activeElement), 'reverse focus trapped');
   await page.keyboard.press('Tab'); check(await page.locator('.modal-close').evaluate(e=>e===document.activeElement), 'forward focus trapped');
   await page.keyboard.press('Escape');
   check(await page.locator('#activityModal').evaluate(e=>e.classList.contains('hidden')), 'Escape closes modal');
   check(await page.locator(`[data-programme="${id}"]`).evaluate(e=>e===document.activeElement), 'focus returns to opener');
   await page.locator('#clearFilters').click();
  }
  for(const [theme, count] of [['Taste of Heritage',1],['Creative Adventures',4],['Little Champions Arena',1],['digital',2],['cultural',2],['family',8],['all',8]]) {
   await page.locator(`[data-theme="${theme}"]`).click(); check(await page.locator('.activity-card').count()===count,`filter ${theme}`);
  }
  await page.locator('#activitySearch').fill('nonexistent'); check(await page.locator('#directoryEmpty').isVisible(), 'empty search state');
  await page.locator('#clearFilters').click(); check(await page.locator('.activity-card').count()===8, 'clear resets search and theme');
  for(const id of [1,2,3,4,5,6]) {
   await page.locator(`[data-register="${id}"]`).click(); check(await page.locator('.mission-brief-box').isVisible(),`original mission ${id}`); await page.keyboard.press('Escape');
  }
  await page.locator('[data-select-agent="ice"]').click();
  check((await page.locator('[data-register]').first().getAttribute('data-register'))==='6', 'agent recommendation sorts original activities');
  await page.locator('.vote-button').click(); check(await page.locator('.vote-button b').textContent()==='2', 'existing vote toggles');
  await page.reload(); await page.waitForFunction(() => getComputedStyle(document.querySelector("#loadingScreen")).visibility === "hidden"); check(await page.locator('.vote-button b').textContent()==='2', 'votes persist');
  check(await page.evaluate(()=>localStorage.getItem('unrelated-data'))==='preserve', 'unrelated localStorage preserved');
  for(const width of [320,375,768,1024,1440]) {
   await page.setViewportSize({width,height:900});
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page width ${width}`);
   check(await page.evaluate(()=>![...document.querySelectorAll('body *')].some(e=>e.checkVisibility({visibilityProperty:true,opacityProperty:true})&&getComputedStyle(e).position!=='fixed'&&e.getBoundingClientRect().right>innerWidth+1)),`no clipped elements ${width}`);
   for(const id of ['memories-meet-digital','travelling-without-borders']) {
    await page.locator(`[data-programme="${id}"]`).click();
    check(await page.locator('.activity-modal-box').evaluate(e=>e.scrollWidth<=e.clientWidth),`modal width ${width}`);
    await page.locator('.programme-call').scrollIntoViewIfNeeded(); check(await page.locator('.programme-call').isVisible(),`registration reachable ${width}`);
    await page.locator('.modal-close').click();
   }
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('[data-programme="memories-meet-digital"]').click();
  await page.locator('.activity-modal-backdrop').click({position:{x:5,y:5}}); check(await page.locator('#activityModal').evaluate(e=>e.classList.contains('hidden')), 'backdrop closes modal');
  // Time travel checks retain past sessions, with no option to register.
  await page.clock.install({time:new Date('2027-02-01T00:00:00Z')});
  await page.locator('[data-programme="memories-meet-digital"]').click();
  check(await page.locator('#programmeSession option:disabled').count()===8,'past sessions disabled');
  check(await page.locator('.programme-date-list li').count()===8,'past dates retained');
  check(!((await page.locator('#activityModalContent').textContent()).includes('Registration successful')), 'no false success');
  check(errors.length===0,`no JavaScript errors: ${errors.join(', ')}`); check(missing.length===0,`no missing local assets: ${missing.join(', ')}`);
  console.log(`PASS: ${checks} browser checks; five viewport widths; no page errors or missing local assets.`);
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
