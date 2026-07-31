const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe.serial('Week 3 Automation Tasks', () => {

  let outputDir;
  let screenshotsDir;
  let resultsFile;

  test.beforeAll(() => {
    // Create directories if they don't exist
    outputDir = path.join(__dirname, '../output/week3');
    screenshotsDir = path.join(outputDir, 'screenshots');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    resultsFile = path.join(outputDir, 'results.txt');
    fs.writeFileSync(resultsFile, 'Week 3 Results\n================\n\n');
  });

  test('Task 12: Multi-tab handling', async ({ page, context }) => {
    console.log('Task 12: /windows');
    await page.goto('https://the-internet.herokuapp.com/windows');
    await page.screenshot({ path: path.join(screenshotsDir, '1_windows_page.png') });
    
    // click the link, switch to new tab
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('text="Click Here"')
    ]);
    
    await newPage.waitForLoadState('domcontentloaded');
    await newPage.screenshot({ path: path.join(screenshotsDir, '2_new_window.png') });
    
    // extract the text
    const newWindowText = await newPage.locator('h3').innerText();
    fs.appendFileSync(resultsFile, '--- Task 12: New Window ---\n' + newWindowText + '\n\n');
    
    // close the tab, return to original
    await newPage.close();
    await page.bringToFront();
  });

  test('Task 13: iframe handling', async ({ page }) => {
    console.log('Task 13: /iframe');
    await page.goto('https://the-internet.herokuapp.com/iframe');
    await page.waitForLoadState('networkidle'); // Wait for TinyMCE to load
    await page.screenshot({ path: path.join(screenshotsDir, '3_iframe_page_before.png') });
    
    const frame = page.frameLocator('#mce_0_ifr');
    const body = frame.locator('body');
    
    // wait for TinyMCE to be fully initialized and editable
    await body.waitFor({ state: 'visible' });
    
    // There might be a close button for the TinyMCE alert in the main frame, click it if it exists
    const closeAlert = page.locator('.tox-notification__dismiss');
    if (await closeAlert.count() > 0) {
      await closeAlert.click();
    }
    
    // Wait for it to become contenteditable
    try {
      await page.waitForFunction(() => {
        const iframe = document.querySelector('#mce_0_ifr');
        if (!iframe) return false;
        return iframe.contentDocument.body.getAttribute('contenteditable') === 'true';
      }, { timeout: 5000 });
    } catch (e) {
      console.log('Timeout waiting for contenteditable, proceeding anyway...');
    }

    // clear existing text by selecting all and deleting
    await body.click();
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    
    await page.keyboard.down(modifier);
    await page.keyboard.press('a');
    await page.keyboard.up(modifier);
    await page.keyboard.press('Backspace');
    
    // type a formatted paragraph (bold + italic using keyboard shortcuts)
    await page.keyboard.down(modifier);
    await page.keyboard.press('b'); // bold
    await page.keyboard.press('i'); // italic
    await page.keyboard.up(modifier);
    
    await page.keyboard.type('This is a formatted paragraph with bold and italic text.');
    
    await page.screenshot({ path: path.join(screenshotsDir, '4_iframe_page_after.png') });
    fs.appendFileSync(resultsFile, '--- Task 13: iframe ---\nTyped formatted paragraph in TinyMCE.\n\n');
  });

  test('Task 14: Nested frames', async ({ page }) => {
    console.log('Task 14: /nested_frames');
    await page.goto('https://the-internet.herokuapp.com/nested_frames');
    await page.screenshot({ path: path.join(screenshotsDir, '5_nested_frames.png') });
    
    // Extract text from frames
    const topFrame = page.frame({ name: 'frame-top' });
    const leftFrame = topFrame.childFrames().find(f => f.name() === 'frame-left');
    const middleFrame = topFrame.childFrames().find(f => f.name() === 'frame-middle');
    const rightFrame = topFrame.childFrames().find(f => f.name() === 'frame-right');
    const bottomFrame = page.frame({ name: 'frame-bottom' });
    
    const leftText = await leftFrame.locator('body').innerText();
    const middleText = await middleFrame.locator('body').innerText();
    const rightText = await rightFrame.locator('body').innerText();
    const bottomText = await bottomFrame.locator('body').innerText();
    
    const nestedFramesText = `Top-Left: ${leftText.trim()}\nTop-Middle: ${middleText.trim()}\nTop-Right: ${rightText.trim()}\nBottom: ${bottomText.trim()}`;
    fs.appendFileSync(resultsFile, '--- Task 14: Nested Frames ---\n' + nestedFramesText + '\n\n');
  });

  test('Task 15: Basic Auth', async ({ browser }) => {
    console.log('Task 15: /basic_auth');
    // Using a new context for basic auth to set credentials cleanly
    const authContext = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'admin'
      }
    });
    const authPage = await authContext.newPage();
    
    await authPage.goto('https://the-internet.herokuapp.com/basic_auth');
    await authPage.screenshot({ path: path.join(screenshotsDir, '6_basic_auth.png') });
    
    const authText = await authPage.locator('.example p').innerText();
    fs.appendFileSync(resultsFile, '--- Task 15: Basic Auth ---\n' + authText + '\n\n');
    
    await authContext.close();
    console.log('Week 3 tasks completed successfully! Check results.txt and screenshots folder.');
  });
});
