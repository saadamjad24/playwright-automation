# Playwright Automation Week 1 and Week 2

A collection of web automation scripts built with Playwright and Node.js.

## Setup Instructions

1. **Install Dependencies:**
```bash
npm install
npx playwright install
```

2. **Run Week 1 (Web Scraping):**
```bash
npx playwright test Automation/week1.js --project=chromium --headed
```

3. **Run Week 2 (Form Automation):**
```bash
npx playwright test Automation/week2.js --project=chromium --headed
```

## Important: Before Running Week 2

Create a file `data/students.csv` with the following format:

```csv
FirstName,LastName,Email,Gender,Mobile,DOBYear,DOBMonth,DOBDay,Subject,Hobby,State,City
Ahmed,Khan,ahmed@example.com,Male,03193456712,1995,May,15,Computer Science,Sports,NCR,Delhi
```

> Note: This file is not included in the repo as per best practices. Create it manually before running Week 2 automation.

## Weekly Tasks

### Week 1: Web Scraping
- Scrapes books rated 4 & 5 stars from books.toscrape.com
- Saves data to JSON file
- Generates HTML report
- Takes full-page screenshots

### Week 2: Form Automation
- Reads student data from CSV file
- Fills out practice form for each student
- Handles date picker, dropdowns, file upload
- Captures confirmation modal screenshots

## Output Files

### Week 1:
- output/week1/books.json
- output/week1/report.html
- output/week1/page-1.png to page-3.png

### Week 2:
- output/week2/student-1.png to student-3.png