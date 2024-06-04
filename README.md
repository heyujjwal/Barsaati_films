# Barsaati Films Assignment
This assignment demonstrates web scraping with Selenium and ProxyMesh, and data storage using MongoDB, all implemented in Node.js. The goal is to fetch the top 5 trending topics from the Twitter home page and store the results in a MongoDB database.


## Introduction
This project is part of an assignment for Barsaati Films. The task involves using Selenium for web scraping, ProxyMesh for managing IP addresses, and MongoDB for data storage. The project includes a simple web interface to trigger the scraping process and display the results.

## Features
Web Scraping: Uses Selenium to scrape the top 5 trending topics from Twitter.
Proxy Management: Utilizes ProxyMesh to rotate IP addresses for each request.
Data Storage: Stores the scraped data in a MongoDB database.
Web Interface: Provides a simple HTML interface to run the scraping script and display results.
Prerequisites
Node.js: Ensure you have Node.js installed on your machine.
MongoDB: Set up a MongoDB instance (local or using a service like MongoDB Atlas).
ProxyMesh Account: Obtain a ProxyMesh account for managing proxies.
Twitter Account: A Twitter account to access the Twitter home page.

## Installation
1. Clone the repository:

 ```sh
git clone https://github.com/heyujjwal/Barsaati_films.git
```
2.Install the dependencies:
 ```sh
npm install
```
## Configuration
Twitter Credentials: Update the index.js file with your Twitter username and password.

MongoDB: Update the MongoDB URI in index.js with your MongoDB connection string.

## Usage
Start the server:
 ```sh
node index.js
```
Open http://localhost:3000 in your browser.
Click the "Click here to run the script" button under the Trending Topic to run the Selenium script and display the results.

## Project Structure
`index.html`: The HTML file providing the web interface.
`index.js`: The Express.js server file handling HTTP requests and the Selenium script for web scraping and data storage.
`package.json`: The Node.js project configuration file.


##Example Configuration
Update/Create the `.env` file with your credentials:

```javascript
MONGO_URI=mongodb://localhost:27017   //(Local Mongodb Database)
MONGO_DB_NAME=<your_database_name>
MONGO_COLLECTION_NAME=your_collection_name>
EMAIL=<your_email>
USERNAME=<your_username>
PASSWORD=<your_password>
