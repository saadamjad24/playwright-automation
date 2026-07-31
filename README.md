# Playwright Web Automation (Week 3)

This project automates web interactions on [The Internet](https://the-internet.herokuapp.com/) using Playwright and Node.js.

## Task Overview
The script performs the following tasks:
1. Navigates to `/windows`, clicks a link, switches to the new tab, extracts text, closes the tab, and returns.
2. Navigates to `/iframe`, switches to the TinyMCE editor, clears the text, and uses keyboard shortcuts (Ctrl+B, Ctrl+I) to type a formatted paragraph.
3. Navigates to `/nested_frames`, and extracts text from each nested frame (top-left, top-middle, top-right, bottom).
4. Navigates to `/basic_auth` (with admin/admin credentials), handles HTTP authentication, and extracts the text.
5. Saves all extracted text into `output/week3/results.txt`.
6. Takes screenshots at each critical step and saves them in `output/week3/screenshots/`.

## Required Data
No external data file is required for this week's task. 

## Setup Instructions

1. **Install Dependencies**:
   Ensure you have Node.js installed, then install the Playwright dependencies:
   ```bash
   npm install @playwright/test
   npx playwright install
   ```

2. **Run the Script**:
   Execute the script using the Playwright test runner:
   ```bash
   npx playwright test Automation/week3.js
   ```

## Output Format Example
After execution, check the `output/week3/` folder for:
- `results.txt` containing all extracted texts from tabs, iframes, and basic auth.
- `screenshots/` directory containing visual proofs of each step.
