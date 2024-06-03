const express = require('express');
const { Key, By, Builder, until } = require('selenium-webdriver');
require('chromedriver');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Use environment variables
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const collectionName = process.env.MONGO_COLLECTION_NAME;
const email = process.env.EMAIL;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function runSeleniumScript() {
    let driver = await new Builder().forBrowser('chrome').build();
    let result = {
        topics: [],
        dateTime: new Date(),
        ipAddress: '',
        uniqueId: uuidv4()
    };

    try {
        await driver.get('https://x.com');

        // Wait for the 'Sign in' link to be clickable
        let signInButton = await driver.wait(until.elementLocated(By.partialLinkText('Sign in')), 20000);
        await driver.wait(until.elementIsVisible(signInButton), 20000);
        await driver.wait(until.elementIsEnabled(signInButton), 20000);

        // Scroll into view if necessary
        await driver.executeScript("arguments[0].scrollIntoView(true);", signInButton);

        // Click the 'Sign in' link
        await signInButton.click();

        // Wait for the login page to load
        await driver.wait(until.titleContains('Log in'), 20000);
        let title = await driver.getTitle();

        if (!title.includes("Log in")) {
            console.log('Failed to load login page');
            return result;
        }

       // Wait for the login page to load
await driver.wait(until.titleContains('Log in'), 20000);
console.log('Login page loaded');

// Input email
let emailField = await driver.wait(until.elementLocated(By.name('text')), 20000);
await emailField.sendKeys(email, Key.RETURN);

// Check for the unusual login activity pop-up
let unusualActivityPopUp;
try {
    unusualActivityPopUp = await driver.wait(until.elementLocated(By.name('text')), 5000);
} catch (error) {
    unusualActivityPopUp = null;
}

if (unusualActivityPopUp) {
    console.log('Unusual login activity pop-up found, entering username.');
    try {
        await unusualActivityPopUp.clear(); // Clear the field first
        await unusualActivityPopUp.sendKeys('Akatsuki___Pain', Key.RETURN);
    } catch (staleElementError) {
        console.log('Stale element error occurred, attempting to re-locate the element.');
        // Re-locate the element
        unusualActivityPopUp = await driver.wait(until.elementLocated(By.name('text')), 5000);
        await unusualActivityPopUp.clear(); // Clear the field first
        await unusualActivityPopUp.sendKeys('Akatsuki___Pain', Key.RETURN);
    }
} else {
    console.log('Unusual login activity pop-up not found, continuing with password input.');
}

// Wait for the password field to appear
let passwordField;
try {
    passwordField = await driver.wait(until.elementLocated(By.name('password')), 20000);
} catch (error) {
    console.log('Timeout occurred while waiting for the password field');
    return result;
}

console.log('Password field located, entering password.');
await passwordField.sendKeys(password, Key.RETURN);



        // Wait for the home page to load completely
        await driver.wait(until.titleContains('Home / X'), 20000);

        // Wait for the "What's happening" section to be visible
        let whatsHappeningSection = await driver.wait(until.elementLocated(By.css('div[data-testid="trend"]')), 20000);

        // Fetch the top 5 trending topics
        let trendingTopics = await driver.findElements(By.css('div[data-testid="trend"] span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3'));

        for (let i = 0; i < Math.min(5, trendingTopics.length); i++) {
            let topicText = await trendingTopics[i].getText();
            result.topics.push(topicText);
        }

        // Fetch IP address using an external service
        let ipResponse = await axios.get('https://api.ipify.org?format=json');
        result.ipAddress = ipResponse.data.ip;

        // Connect to MongoDB and insert the record
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const mongoRecord = {
            _id: result.uniqueId,
            nameoftrend1: result.topics[0] || '',
            nameoftrend2: result.topics[1] || '',
            nameoftrend3: result.topics[2] || '',
            nameoftrend4: result.topics[3] || '',
            nameoftrend5: result.topics[4] || '',
            dateTime: result.dateTime,
            ipAddress: result.ipAddress
        };

        await collection.insertOne(mongoRecord);
        result.mongoRecord = mongoRecord;

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await driver.quit();
    }

    return result;
}

app.use(express.static('public'));

app.get('/run-script', async (req, res) => {
    let result = await runSeleniumScript();
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
