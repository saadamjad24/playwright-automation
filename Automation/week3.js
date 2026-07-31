

const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Week 3: Multi-Tab & iframe Handling', async ({ page, context }) => {

  const screenshotsDir = path.join(__dirname, '..', 'output', 'week3', 'screenshots');
  const resultsFile = path.join(__dirname, '..', 'output', 'week3', 'results.txt');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let results = '';

  
  // Multi-Tab Handling
  
  console.log('Multi-Tab Handling...');

  await page.goto('https://the-internet.herokuapp.com/windows');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotsDir, '01-windows-page.png'), fullPage: true });

  const [newTab] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a[href="/windows/new"]').click()
  ]);

  await newTab.waitForLoadState('networkidle');
  const newTabText = await newTab.locator('h3').textContent();
  console.log(`New Tab Text: ${newTabText}`);
  await newTab.screenshot({ path: path.join(screenshotsDir, '02-new-tab.png'), fullPage: true });

  await newTab.close();
  await page.bringToFront();
  await page.screenshot({ path: path.join(screenshotsDir, '03-returned-to-original.png'), fullPage: true });

  results += 'Multi-Tab Handling\n';
  results += `New Tab Text: ${newTabText}\n\n`;

  // Task 13: iframe Handling 
 
  await page.goto('https://the-internet.herokuapp.com/iframe');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000);
await page.screenshot({ path: path.join(screenshotsDir, '04-iframe-page.png'), fullPage: true });

// Dismiss TinyMCE popup if visible
const dismissBtn = page.locator('.tox-notification__dismiss');
if (await dismissBtn.isVisible()) {
    await dismissBtn.click();
    await page.waitForTimeout(500);
}

// Switch into TinyMCE iframe
const iframeHandle = page.frameLocator('#mce_0_ifr');

// Click body to focus with force
await iframeHandle.locator('body#tinymce').click({ force: true });
await page.waitForTimeout(1000);

// Select all and delete
await page.keyboard.press('Control+a');
await page.keyboard.press('Backspace');
await page.waitForTimeout(500);

// Type bold text
await page.keyboard.press('Control+b');
await page.keyboard.type('Bold Text', { delay: 100 });
await page.keyboard.press('Control+b');

// Space
await page.keyboard.type(' ');

// Type italic text
await page.keyboard.press('Control+i');
await page.keyboard.type('Italic Text', { delay: 100 });
await page.keyboard.press('Control+i');

await page.waitForTimeout(500);
await page.screenshot({ path: path.join(screenshotsDir, '05-iframe-typed.png'), fullPage: true });

results += 'iframe Handling\n';
results += 'Cleared existing text and typed bold + italic text in TinyMCE iframe\n\n';

  // Task 14: Nested Frames

  console.log('Nested Frames...');

  await page.goto('https://the-internet.herokuapp.com/nested_frames');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotsDir, '06-nested-frames.png'), fullPage: true });

  // frame-left, frame-middle, frame-right are INSIDE frame-top
 
  const topLeftText = await page.frame({ name: 'frame-left' }).locator('body').innerText();
  const topMiddleText = await page.frame({ name: 'frame-middle' }).locator('body').innerText();
  const topRightText = await page.frame({ name: 'frame-right' }).locator('body').innerText();
  const bottomText = await page.frame({ name: 'frame-bottom' }).locator('body').innerText();

  console.log(`Top Left: ${topLeftText}`);
  console.log(`Top Middle: ${topMiddleText}`);
  console.log(`Top Right: ${topRightText}`);
  console.log(`Bottom: ${bottomText}`);

  results += 'Nested Frames\n';
  results += `Top Left: ${topLeftText}\n`;
  results += `Top Middle: ${topMiddleText}\n`;
  results += `Top Right: ${topRightText}\n`;
  results += `Bottom: ${bottomText}\n\n`;

  
  // Basic Auth
 
  console.log('Basic Auth...');

  await page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotsDir, '07-basic-auth.png'), fullPage: true });

  const authText = await page.locator('.example p').textContent();
  console.log(`Auth Text: ${authText}`);

  results += 'Basic Auth\n';
  results += `Auth Result: ${authText}\n\n`;

 
  // Save results.txt
  
  console.log('Saving results to results.txt...');
  fs.writeFileSync(resultsFile, results);
  console.log(`Results saved to: ${resultsFile}`);

  await page.screenshot({ path: path.join(screenshotsDir, '08-final.png'), fullPage: true });

  console.log('Week 3 automation completed successfully!');
});