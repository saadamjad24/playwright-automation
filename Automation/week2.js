const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Week 2: Form Automation', () => {

    // Read and parse CSV data
   const csvPath = path.join(__dirname, '..', 'data', 'students.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    const rows = csvData.trim().split('\n');

    // Extract headers and data rows
    const headers = rows[0].split(',').map(h => h.trim());
    const students = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        let student = {};
        headers.forEach((header, index) => {
            student[header] = values[index];
        });
        return student;
    });

    test('Fill and submit forms for all students', async ({ page }) => {

        // Loop through each student record
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            console.log(`Processing student: ${student.FirstName} ${student.LastName}`);

            // Navigate to the form
            await page.goto('https://demoqa.com/automation-practice-form', { waitUntil: 'load' });
            await page.waitForTimeout(3000);
            // Remove footer and fixed ads to prevent them from obscuring elements
            await page.evaluate(() => {
                const footer = document.querySelector('footer');
                if (footer) footer.remove();
                const fixedban = document.getElementById('fixedban');
                if (fixedban) fixedban.remove();
            });

            // Fill text fields
            await page.locator('#firstName').fill(student.FirstName);
            await page.locator('#lastName').fill(student.LastName);
            await page.locator('#userEmail').fill(student.Email);
           
            // Select Gender (clicking the label)
            await page.getByText(student.Gender, { exact: true }).click();
             await page.locator('#userNumber').fill(student.Mobile);


            // Date of Birth - calendar interaction
            await page.locator('#dateOfBirthInput').click();
            await page.waitForTimeout(1000);
            await page.locator('.react-datepicker__month-select').selectOption({ label: student.DOBMonth });
            await page.locator('.react-datepicker__year-select').selectOption({ label: student.DOBYear });

            // Select the correct day (filtering out outside month days to avoid selecting wrong month's days if numbers overlap)
            const dayToSelect = parseInt(student.DOBDay).toString(); // remove leading zeros if any
            await page.locator(`.react-datepicker__day:not(.react-datepicker__day--outside-month)`).filter({ hasText: new RegExp(`^${dayToSelect}$`) }).click();

            // Multi-select Subjects (Autocomplete)
            await page.locator('#subjectsInput').pressSequentially(student.Subject, { delay: 100 });
            await page.locator('.subjects-auto-complete__menu').getByText(student.Subject).click();

            // Checkbox for Hobby (clicking the label)
            await page.getByText(student.Hobby, { exact: true }).click();

            // File Upload
            const imagePath = path.join(__dirname, '..', 'assets', 'sample.jpg');
            await page.locator('#uploadPicture').setInputFiles(imagePath);

            // Address
            const address = "123 Main St, " + student.City;
            await page.locator('#currentAddress').fill(address);

            // State & City Dependent Dropdowns
            // State
            await page.locator('#state').click();
            await page.locator('#state').getByText(student.State, { exact: true }).click();

            // City
            await page.locator('#city').click();
            await page.locator('#city').getByText(student.City, { exact: true }).click();

            // Submit Form
            await page.locator('#submit').click();

            // Wait for confirmation modal
            const modal = page.locator('.modal-content');
            await expect(modal).toBeVisible();

            // Capture modal text
            const modalTitle = await modal.locator('.modal-title').textContent();
            console.log(`Modal Title for ${student.FirstName}: ${modalTitle}`);

            // Take a screenshot of the modal
            const outputDir = path.join(__dirname, '..', 'output', 'week2');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            const screenshotPath = path.join(outputDir, `student-${i + 1}.png`);
            await modal.screenshot({ path: screenshotPath });

            // Close the modal to proceed with the next iteration 
            await page.locator('#closeLargeModal').click();
        }
    });
});
