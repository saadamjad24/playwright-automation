# Playwright Automation Project

A collection of web automation scripts built with Playwright and Node.js.

---

## Week 1: Web Scraping Automation

### What it does:
This automation scrapes book data from [books.toscrape.com](https://books.toscrape.com) and generates structured output files.

### Process:
1. Opens the website in a browser automatically
2. Loops through first 3 pages
3. Filters books rated 4 and 5 stars only
4. Extracts Title, Price, Rating and Availability for each book
5. Saves all data to a structured JSON file
6. Generates an HTML report from the JSON data
7. Takes a full-page screenshot of each page after scraping

### How to run:
```bash
git checkout week1
npm install
npx playwright install
npx playwright test Automation/week1.js --project=chromium --headed
```

### Output files generated:
- `output/week1/books.json` — scraped book data
- `output/week1/report.html` — visual HTML report
- `output/week1/page-1.png` to `page-3.png` — full page screenshots

---

## Week 2: Form Automation & Dynamic Dropdowns

### What it does:
This automation reads student data from a CSV file and fills out a practice form for each student automatically.

### Process:
1. Reads 3 student records from `data/students.csv`
2. For each student, navigates to the form and fills:
   - Text fields (First Name, Last Name, Email, Mobile)
   - Radio button (Gender)
   - Date picker using calendar widget (DOB)
   - Multi-select subjects using autocomplete dropdown
   - Hobbies checkbox
   - File upload (sample image)
   - State & City dependent dropdowns
3. Submits the form
4. Captures confirmation modal title and logs to console
5. Takes a screenshot of the modal for each student

### Required Data:
Before running Week 2, create the file `data/students.csv` manually.

> ⚠️ This file is NOT included in the repo as per best practices. Never push data files to GitHub.

### CSV Format:
```csv
FirstName,LastName,Email,Gender,Mobile,DOBYear,DOBMonth,DOBDay,Subject,Hobby,State,City
```

### Example:
```csv
FirstName,LastName,Email,Gender,Mobile,DOBYear,DOBMonth,DOBDay,Subject,Hobby,State,City
Ahmed,Khan,ahmed@example.com,Male,03193456712,1995,May,15,Computer Science,Sports,NCR,Delhi
Fatima,Ali,fatima@example.com,Female,03019876543,1998,August,22,Maths,Reading,Uttar Pradesh,Agra
Usman,Raza,usman@example.com,Male,03195567610,2000,December,10,Physics,Music,Haryana,Karnal
```

### Available Options:
- **Gender:** Male, Female, Other
- **Subject:** Maths, Physics, Chemistry, Computer Science, English etc.
- **Hobby:** Sports, Reading, Music
- **State & City:** NCR (Delhi, Gurgaon), Uttar Pradesh (Agra, Lucknow), Haryana (Karnal, Panipat)

### How to run:
```bash
git checkout week2
npm install
npx playwright install
npx playwright test Automation/week2.js --project=chromium --headed
```

### Output files generated:
- `output/week2/student-1.png` — modal screenshot for student 1
- `output/week2/student-2.png` — modal screenshot for student 2
- `output/week2/student-3.png` — modal screenshot for student 3

---
