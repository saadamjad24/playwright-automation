const { test, request } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('Week 4: API Interaction + Browser Automation Combo', async ({ page }) => {

   
    // Setup Output Directories
   
    const outputDir = path.join(__dirname, '..', 'output', 'week4');
    const screenshotsDir = path.join(outputDir, 'screenshots');

    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    let resultsLog = '';
    let allUsers = [];


    const apiContext = await request.newContext({
        baseURL: 'https://jsonplaceholder.typicode.com'
    });

   
    // GET List Users Page 1 

    console.log('GET: List Users Page 1');
    const getPage1 = await apiContext.get('/users?_start=0&_limit=6');
    const getPage1Body = await getPage1.json();

    console.log(`Status: ${getPage1.status()}`);
    console.log(`Body: ${JSON.stringify(getPage1Body, null, 2)}`);

    resultsLog += '=== GET Users Page 1 ===\n';
    resultsLog += `Status: ${getPage1.status()}\n`;
    resultsLog += `Body: ${JSON.stringify(getPage1Body, null, 2)}\n\n`;

    // Collect users from page 1
    allUsers = [...allUsers, ...getPage1Body];

   
    // GET List Users Page 2

    console.log('GET: List Users Page 2');
    const getPage2 = await apiContext.get('/users?_start=6&_limit=4');
    const getPage2Body = await getPage2.json();

    console.log(`Status: ${getPage2.status()}`);
    console.log(`Body: ${JSON.stringify(getPage2Body, null, 2)}`);

    resultsLog += '=== GET Users Page 2 ===\n';
    resultsLog += `Status: ${getPage2.status()}\n`;
    resultsLog += `Body: ${JSON.stringify(getPage2Body, null, 2)}\n\n`;

    // Collect users from page 2
    allUsers = [...allUsers, ...getPage2Body];

  
    // POST Create 3 New Users
 
    const newUsers = [
        { name: 'Saadi Amjad', username: 'saadi', email: 'saadi@test.com', phone: '111-111', website: 'saadi.dev' },
        { name: 'John Smith', username: 'john', email: 'john@test.com', phone: '222-222', website: 'john.dev' },
        { name: 'Sara Khan', username: 'sara', email: 'sara@test.com', phone: '333-333', website: 'sara.dev' }
    ];

    for (let i = 0; i < newUsers.length; i++) {
        console.log(`POST: Creating user ${i + 1}...`);
        const postRes = await apiContext.post('/users', {
            data: newUsers[i]
        });
        const postBody = await postRes.json();

        console.log(`Status: ${postRes.status()}`);
        console.log(`Body: ${JSON.stringify(postBody, null, 2)}`);

        resultsLog += `=== POST Create User ${i + 1} ===\n`;
        resultsLog += `Status: ${postRes.status()}\n`;
        resultsLog += `Body: ${JSON.stringify(postBody, null, 2)}\n\n`;
    }

 
    // PUT  Update User #2

    console.log('PUT: Updating User #2');
    const putRes = await apiContext.put('/users/2', {
        data: {
            name: 'Ervin Howell Updated',
            username: 'ervin_updated',
            email: 'ervin.updated@test.com',
            phone: '999-999',
            website: 'ervin-updated.dev'
        }
    });
    const putBody = await putRes.json();

    console.log(`Status: ${putRes.status()}`);
    console.log(`Body: ${JSON.stringify(putBody, null, 2)}`);

    resultsLog += '=== PUT Update User #2 ===\n';
    resultsLog += `Status: ${putRes.status()}\n`;
    resultsLog += `Body: ${JSON.stringify(putBody, null, 2)}\n\n`;

    // DELETE - User #3
   
    console.log('DELETE: Deleting User #3');
    const deleteRes = await apiContext.delete('/users/3');

    console.log(`Status: ${deleteRes.status()}`);

    resultsLog += '=== DELETE User #3 ===\n';
    resultsLog += `Status: ${deleteRes.status()}\n`;
    resultsLog += `Body: (200 means success)\n\n`;

    // Save results log
    fs.writeFileSync(path.join(outputDir, 'api-results.txt'), resultsLog);
    console.log('API results saved.');

    await apiContext.dispose();

   
    // Navigate to jsonplaceholder

    console.log('Navigating to jsonplaceholder...');
    await page.goto('https://jsonplaceholder.typicode.com/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
        path: path.join(screenshotsDir, 'jsonplaceholder.png'),
        fullPage: true
    });

  
    // Generate  HTML Report
   
    console.log('Generating HTML report...');

    const tableRows = allUsers.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.website}</td>
        </tr>
    `).join('');

    const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Week 4 - User Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f2f5;
            padding: 40px;
        }
        .container {
            max-width: 1100px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px 40px;
        }
        .header h1 { font-size: 28px; margin-bottom: 6px; }
        .header p  { opacity: 0.85; font-size: 14px; }
        .stats {
            display: flex;
            gap: 20px;
            padding: 20px 40px;
            background: #fafafa;
            border-bottom: 1px solid #eee;
        }
        .stat-box {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 14px 24px;
            text-align: center;
        }
        .stat-box .number { font-size: 28px; font-weight: bold; color: #667eea; }
        .stat-box .label  { font-size: 12px; color: #888; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #667eea; color: white; }
        thead th {
            padding: 14px 16px;
            text-align: left;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        tbody tr { border-bottom: 1px solid #f0f0f0; }
        tbody tr:hover { background: #f8f9ff; }
        tbody td { padding: 12px 16px; font-size: 13px; color: #333; }
        .footer {
            text-align: center;
            padding: 20px;
            background: #fafafa;
            color: #aaa;
            font-size: 12px;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">

        <div class="header">
            <h1>📋 User Report</h1>
            <p>Week 4 — API Interaction + Browser Automation | Generated by Playwright</p>
        </div>

        <div class="stats">
            <div class="stat-box">
                <div class="number">${allUsers.length}</div>
                <div class="label">Total Users</div>
            </div>
            <div class="stat-box">
                <div class="number">2</div>
                <div class="label">Pages Fetched</div>
            </div>
            <div class="stat-box">
                <div class="number">3</div>
                <div class="label">Users Created</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Website</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>

        <div class="footer">
            Generated on ${new Date().toLocaleString()} — Playwright Week 4 Automation
        </div>

    </div>
</body>
</html>`;

    const htmlPath = path.join(outputDir, 'report.html');
    fs.writeFileSync(htmlPath, htmlReport);
    console.log('HTML report generated.');

    
    // Open HTML file in browser + screenshot
   
    console.log('Opening HTML report in browser...');
    await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
        waitUntil: 'networkidle'
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
        path: path.join(screenshotsDir, 'final-report.png'),
        fullPage: true
    });

    console.log('Week 4 completed successfully!');
});