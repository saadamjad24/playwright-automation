# Playwright Web Scraping Automation (Week 1)

This project automates web scraping on [Books to Scrape](https://books.toscrape.com/) using Playwright and Node.js.

## The Automation & Process
The script performs the following tasks:
1. Navigates to the target site.
2. Scrapes all books rated 4 stars and above from the first 3 pages.
3. Extracts the following data for each matched book: Title, Price, Rating, and Availability.
4. Writes the extracted data into a structured JSON file.
5. Generates a simple HTML report from the JSON data using the Node.js `fs` module.
6. Takes a full-page screenshot of each of the 3 scraped pages.

## Required Data
No external data files or CSVs are required for this week's task, as the data is scraped directly from the website.

## Example Format
The output `books.json` format will look like this:
```json
[
  {
    "title": "A Light in the Attic",
    "price": "£51.77",
    "rating": "3",
    "availability": "In stock"
  }
]
```

## Setup Instructions

1. **Install Dependencies**:
   Ensure you have Node.js installed, then install the Playwright dependencies:
   ```bash
   npm install @playwright/test
   npx playwright install
   ```

2. **Run the Script**:
   Execute the scraping script using Node:
   ```bash
   npx playwright test Automation/week1.js
   ```

## Output
After execution, check the `output/week1/` folder for:
- `page-1.png`, `page-2.png`, `page-3.png` - Full-page screenshots.
- `books.json` - Structured JSON containing the scraped books.
- `report.html` - A styled HTML report presenting the data.
