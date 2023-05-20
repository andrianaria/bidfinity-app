# Project Title

Bidfinity - Bidding made easy

# Project Description

This project is a backend application built with Node.js, Express.js, TypeScript, Sequelize, and MySQL. It provides a RESTful API for the bidfinity features from User registration to simple bidding system.

Find the complete documentation here: https://coral-radio-b35.notion.site/Bidfinity-App-3bef0526fcae48e5875a9c1bc4c87bdc

# Prerequisites

1. Node.js and npm installed on your machine
2. MySQL server set up and running

# Installation

1. Clone the repository:
   `git clone [repository-url]`
2. Install dependencies:
   `cd [project-directory]`
   `npm install`

# Configuration

1. Rename the .env.example file to .env.
2. Open the .env file and provide the necessary configuration values for your MySQL database.
3. You can create your own 256-bit random string for JWT secret key, i.e `openssl rand -hex 32`
4. Migrate the database structure: `npx sequelize-cli db:migrate`
5. Seed the data for your local testing purposes: `npx sequelize-cli db:seed:all`

# Usage

To start the server, run the following command:
`npm start`
The server will start running on http://localhost:3000

# API Endpoints

1. **`/api/login`** - POST request to authenticate a user and retrieve an access token for subsequent requests. Requires providing the user's login credentials.
2. **`/api/signup`** - POST request to register a new user. Requires providing the user's registration details such as name, email, and password.
3. **`/api/items/completed`** - GET request to fetch a list of completed items. Requires authentication with a valid access token. Returns an array of items that time window has exceeded current time.
4. **`/api/items/ongoing`** - GET request to retrieve a list of ongoing items. Requires authentication with a valid access token. Returns an array of items that are currently in progress (time window is still within current time).
5. **`/api/items/draft`** - GET request to fetch a list of draft items. Requires authentication with a valid access token. Returns an array of items that are still in draft status and have not been published yet.
6. **`/api/items/:itemId/history`** - GET request to retrieve the history of bids for a specific item identified by its **`itemId`**. Requires authentication with a valid access token. Returns a detailed history log of changes made to the item.
7. **`/api/items/:itemId/publish`** - POST request to publish an item identified by its **`itemId`**. Requires authentication with a valid access token. Changes the status of the item from draft to published, making it publicly available.
8. **`/api/items`** - POST request to create a new item. Requires authentication with a valid access token. Accepts the necessary data for creating a new item. Returns the created item with a unique identifier.
9. **`/api/deposit`** - POST request to create a new deposit. Requires authentication with a valid access token. Allows users to make a deposit transaction to their balance.
10. **`/api/bid`** - POST request to place a bid on an item. Requires authentication with a valid access token. Users can submit their bid details.

# Online Demo

You can try the online demo for this app on : http://54.167.173.13

# Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open a GitHub issue or submit a pull request.

# Contact

http://riaandriana.com
