const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Slow down Playwright execution to make it visible at a normal speed
test.use({ launchOptions: { slowMo: 1000 } });

test('Week 1: Scrape books', async ({ page }) => {
  // Define output directory to keep files organized properly
  const outputDir = path.join(__dirname, '..', 'output', 'week1');
  
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const data = [];
  
  try {
    // Navigate to the site
    await page.goto('https://books.toscrape.com/');

    for (let i = 1; i <= 3; i++) {

      // Scrape data from the current page
      const books = await page.locator('article.product_pod').all();
      
      for (const book of books) {
        const ratingClass = await book.locator('p.star-rating').getAttribute('class');
        
        // Scrape all books rated 4 stars and above
        if (ratingClass.includes('Four') || ratingClass.includes('Five')) {
          const title = await book.locator('h3 a').getAttribute('title');
          const price = await book.locator('.price_color').innerText();
          const availability = await book.locator('.instock.availability').innerText();
          
          // For each book, extract: Title, Price, Rating, Availability
          data.push({
            title: title.trim(),
            price: price.trim(),
            rating: ratingClass.replace('star-rating', '').trim(),
            availability: availability.trim()
          });
        }
      }

      // Take a full-page screenshot after scraping each page
      const screenshotPath = path.join(outputDir, `page-${i}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // Navigate to next page if not the last one
      if (i < 3) {
        const nextButton = page.locator('li.next a');
        if (await nextButton.isVisible()) {
            await nextButton.click();
            await page.waitForLoadState('networkidle');
        } else {
            console.warn(`No next button found on page ${i}`);
            break; // Stop if there are no more pages
        }
      }
    }

    // Write the data into a structured JSON file
    const jsonPath = path.join(outputDir, 'books.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    // Generate a simple HTML report from that JSON
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Top Rated Books</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Top Rated Books (4 & 5 Stars)</h2>
        <table>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Availability</th>
          </tr>
          ${data.map(b => `
            <tr>
              <td>${b.title}</td>
              <td>${b.price}</td>
              <td>${b.rating}</td>
              <td>${b.availability}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;
    
    const htmlPath = path.join(outputDir, 'report.html');
    fs.writeFileSync(htmlPath, htmlContent);

    console.log(`Scraping completed successfully. Output files saved in: ${outputDir}`);
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    throw error;
  }
});