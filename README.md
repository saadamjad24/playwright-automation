# Playwright Web Scraping Automation (Week 1)

This project automates web scraping on [Books to Scrape](https://books.toscrape.com/) using Playwright and Node.js.

## Task Overview
The script performs the following tasks:
1. Navigates to the target site.
2. Scrapes all books rated 4 stars and above from the first 3 pages.
3. Extracts the following data for each matched book: Title, Price, Rating, and Availability.
4. Writes the extracted data into a structured JSON file.
5. Generates a simple HTML report from the JSON data using the Node.js `fs` module.
6. Takes a full-page screenshot of each of the 3 scraped pages.

## Features
- **End-to-End Automation**: The script runs completely without manual intervention.
- **Robust Error Handling**: Uses proper `async/await` syntax and `try/catch` blocks.
- **Clean Output Organization**: All generated files (JSON, HTML, screenshots) are cleanly organized into the `output/week1/` directory.
- **Clear Code**: Clean and readable code with comments explaining key steps.

## Setup Instructions

1. **Install Dependencies**:
   Ensure you have Node.js installed, then install the Playwright dependencies:
   ```bash
   npm install
   npx playwright install
   ```

2. **Run the Script**:
   Execute the scraping script using the Playwright test runner:
   ```bash
   npx playwright test Automation/week1.js
   ```

## Output
After execution, check the `output/week1/` folder for:
- `page-1.png`, `page-2.png`, `page-3.png` - Full-page screenshots.
- `books.json` - Structured JSON containing the scraped books.
- `report.html` - A styled HTML report presenting the data.
