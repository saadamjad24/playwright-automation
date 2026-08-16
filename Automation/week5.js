const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'week5-config.json'), 'utf-8')
);

test('Week 5: E-Commerce Workflow with Data-Driven Input', async ({ page }) => {

    const outputDir = path.join(__dirname, '..', 'output', 'week5');
    const screenshotsDir = path.join(outputDir, 'screenshots');

    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const summaryResults = [];

    for (let i = 0; i < config.users.length; i++) {
        const user = config.users[i];
        console.log(`Processing user: ${user.username}`);
        
        // Login
       
        console.log(`Logging in as ${user.username}...`);
        await page.goto('https://www.saucedemo.com/');
        await page.waitForLoadState('networkidle');

        await page.fill('#user-name', user.username);
        await page.fill('#password', user.password);
        await page.click('#login-button');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotsDir, `${i + 1}-${user.username}-login.png`),
            fullPage: true
        });
        console.log(`Login successful for ${user.username}`);

        
        // Add products to cart
        console.log(`Adding products to cart for ${user.username}...`);

        for (const productName of user.products) {
            const productCards = page.locator('.inventory_item');
            const count = await productCards.count();

            for (let j = 0; j < count; j++) {
                const card = productCards.nth(j);
                const title = await card.locator('.inventory_item_name').textContent();

                if (title.trim() === productName.trim()) {
                    await card.locator('button').click();
                    await page.waitForTimeout(300);
                    console.log(`Added to cart: ${productName}`);
                    break;
                }
            }
        }

        await page.screenshot({
            path: path.join(screenshotsDir, `${i + 1}-${user.username}-products-added.png`),
            fullPage: true
        });

       
        // Go to cart and verify
       
        console.log(`Going to cart...`);
        await page.click('.shopping_cart_link');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotsDir, `${i + 1}-${user.username}-cart.png`),
            fullPage: true
        });

        const cartItems = page.locator('.cart_item');
        const cartCount = await cartItems.count();
        const orderedItems = [];

        console.log(`Cart items for ${user.username}:`);
        for (let k = 0; k < cartCount; k++) {
            const item = cartItems.nth(k);
            const name = await item.locator('.inventory_item_name').textContent();
            const price = await item.locator('.inventory_item_price').textContent();
            console.log(`  - ${name}: ${price}`);
            orderedItems.push({ name: name.trim(), price: price.trim() });
        }

        
        // Proceed to checkout
        
        console.log(`Proceeding to checkout...`);
        await page.click('#checkout');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Clear and fill each field carefully
        await page.fill('#first-name', '');
        await page.fill('#first-name', user.firstName);
        await page.waitForTimeout(300);

        await page.fill('#last-name', '');
        await page.fill('#last-name', user.lastName);
        await page.waitForTimeout(300);

        await page.fill('#postal-code', '');
        await page.fill('#postal-code', user.zipCode);
        await page.waitForTimeout(300);

        await page.screenshot({
            path: path.join(screenshotsDir, `${i + 1}-${user.username}-checkout-info.png`),
            fullPage: true
        });

        await page.click('#continue');
        await page.waitForTimeout(2000);

        // Check if error appeared (problem_user bug)
        const errorBanner = page.locator('[data-test="error"]');
        const hasError = await errorBanner.isVisible();

        if (hasError) {
            const errorMsg = await errorBanner.textContent();
            console.log(`Checkout error for ${user.username}: ${errorMsg}`);
            console.log(`Skipping to next user...`);

            // Go directly to inventory page where burger menu exists
            await page.goto('https://www.saucedemo.com/inventory.html');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            // Wait for burger menu to be visible before clicking
            await page.waitForSelector('#react-burger-menu-btn', { state: 'visible' });
            await page.click('#react-burger-menu-btn');
            await page.waitForTimeout(1000);

            // Wait for logout link to be visible before clicking
            await page.waitForSelector('#logout_sidebar_link', { state: 'visible' });
            await page.click('#logout_sidebar_link');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            await page.screenshot({
                path: path.join(screenshotsDir, `${i + 1}-${user.username}-logout.png`),
                fullPage: true
            });

            summaryResults.push({
                user: user.username,
                items_ordered: orderedItems,
                item_total: 'N/A - checkout error',
                tax: 'N/A',
                total: 'N/A',
                timestamp: new Date().toISOString(),
                note: `Checkout failed: ${errorMsg}`
            });

            continue;
        }

       
        // Extract totals from overview
        
        console.log(`Extracting totals...`);
        const itemTotal = await page.locator('.summary_subtotal_label').textContent();
        const tax = await page.locator('.summary_tax_label').textContent();
        const grandTotal = await page.locator('.summary_total_label').textContent();

        console.log(`Item Total: ${itemTotal}`);
        console.log(`Tax: ${tax}`);
        console.log(`Grand Total: ${grandTotal}`);

        await page.screenshot({
            path: path.join(screenshotsDir, `${i + 1}-${user.username}-overview.png`),
            fullPage: true
        });

        
        // Complete order
        
        await page.click('#finish');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotsDir, `${i + 1}-${user.username}-confirmation.png`),
            fullPage: true
        });
        console.log(`Order confirmed for ${user.username}`);

        
        // Logout
       
        console.log(`Logging out...`);
        await page.waitForSelector('#react-burger-menu-btn', { state: 'visible' });
        await page.click('#react-burger-menu-btn');
        await page.waitForTimeout(1000);

        await page.waitForSelector('#logout_sidebar_link', { state: 'visible' });
        await page.click('#logout_sidebar_link');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: path.join(screenshotsDir, `${i + 1}-${user.username}-logout.png`),
            fullPage: true
        });
        console.log(`Logged out successfully`);

        
        // Save user summary
        
        summaryResults.push({
            user: user.username,
            items_ordered: orderedItems,
            item_total: itemTotal.trim(),
            tax: tax.trim(),
            total: grandTotal.trim(),
            timestamp: new Date().toISOString()
        });
    }

    
    // Save summary JSON
    
    console.log('\nSaving summary JSON...');
    const summaryPath = path.join(outputDir, 'summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summaryResults, null, 2));
    console.log(`Summary saved to: ${summaryPath}`);

    console.log('\nWeek 5 completed successfully!');
});