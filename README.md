# Playwright Web Automation (Week 2)

This project automates web interactions on [DemoQA](https://demoqa.com/automation-practice-form) using Playwright and Node.js.

## The Automation & Process
The script automates the process of filling out a complex web form for multiple users. 
1. The script first parses student data from a local CSV file.
2. It loops through each student record and navigates to the DemoQA Practice Form.
3. It dynamically interacts with various HTML elements including text inputs, radio buttons, checkboxes, dropdowns, date pickers, and even performs a file upload.
4. Finally, it submits the form and takes a screenshot of the filled form.

## Required Data
The automation requires a CSV file located at `data/students.csv`. This file must contain the student records that you wish to process.
Additionally, you need a sample image file located at `assets/sample.jpg` to test the file upload functionality.

## Example Format
The `data/students.csv` should follow this format:

```csv
firstName,lastName,email,gender,mobile,dob,subjects,hobbies,address,state,city
John,Doe,john@test.com,Male,1234567890,15 May 2000,Maths,Sports,123 Street,NCR,Delhi
Jane,Smith,jane@test.com,Female,0987654321,20 June 2001,Physics,Reading,456 Avenue,Haryana,Karnal
```

## Setup Instructions

1. **Install Dependencies**:
   Ensure you have Node.js installed, then install the Playwright dependencies:
   ```bash
   npm install @playwright/test
   npx playwright install
   ```

2. **Run the Script**:
   Execute the script using Node:
   ```bash
   npx playwright test Automation/week2.js
   ```

## Output
After execution, check the `output/week2/` folder for screenshots of each submitted form.
