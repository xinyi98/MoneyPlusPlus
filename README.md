# Money++ (Group 10 Green Gorilla)
[![Node.js CI](https://github.com/csdoris/Group-10-Green-Gorilla/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/csdoris/Group-10-Green-Gorilla/actions/workflows/node.js.yml)

<p align="center">
  <img src="./frontend/src/Assets/logo.svg" alt="MoneyPlusPlusLogo"/>
</p>

A web app for your personal bookkeeping!

Because of COVID-19, multiple families and individuals are in severe financial hardships. In order to minimise the impact of any financial hardships, we created this app to let people know and understand their money better and also gain knowledges on saving and personal finance in general.

## Team Information

We are Group 10 Green Gorilla!
| Name | UPI | GitHub Username |
| ---------------- | --------------- | ------- |
| Tommy Shi | yshi428 | tommyshi55 |
| Jiawei Ge | jge385 | jge385 |
| Yicheng Sun | ysun499 | lhsunyc |
| Xinyi Guo | xguo670 | xinyi98 |

## Main Functional Features

- Record your personal transactions (income/expense)
- Get a summary graph view of your financial situation
- Set and keep a short-term and long-term saving target
- Access to informational videos about personal finance and saving tips
- View the exchange rate and price of some famous crypto!

## Technology Stack

- MongoDB and Mongoose for NoSQL database
- Node.js and Express API server
- React for frontend

## Setup Instruction

### Prerequisites:

- Node.js 14+
- npm 7+
- Clone the repository by running

  `git clone https://github.com/csdoris/Group-10-Green-Gorilla.git`

### Instruction:

#### Backend

1. Open the terminal and `cd` into the `/backend` directory of the project
2. Run `npm install` to install the dependencies
3. Run `npm start` to start up the server, you should see the following line printing out on the console:
   ```
   Server listening on port 8000
   Successfully connected to MongoDB cluster
   ```

#### Frontend

1. Open the terminal and `cd` into the `/frontend` directory of the project
2. Run `npm install` to install the dependencies
3. Run `npm start` to start up the React frontend

After executing the previous steps, go to `http://localhost:3000/` and start using the app!

## Note

- the `.env` files for both `/backend` and `/frontend` are committed in the repository
- Please do not spam the Tips section of the app. It utilises the search function from the YouTube API. However, the request limit is quite low which can be easily exceeded. The app will display nice error message when the limit has exceeded
- You are welcomed to use the following account for testing. It is already loaded with some data. However, feel free to create your own account:
  ```
  Username: green_gorilla
  Password: 123456
  ```

## Project Q&As

### How well have you mastered React, git, and other tools / frameworks introduced in this course?

- We used Git and GitHub heavily throughout the project. We used a lot of features such as issue tracking, pull request, branching, merging, code review, project Kanban board and wiki documentation
- We used the entire MERN stack for this app

### Have you shown the ability to carry out further learning beyond the course material to add value to your prototype?

- We used GitHub Actions to set up our Continous Integration workflow
- We used several external APIs including YouTube API and Crypto API
- We used complex MongoDB query such as aggregation and custom accumulator
- We used MongoDB Atlas to run database on the cloud
- We used Eslint and Prettier to enforce code styles

### Has your code been developed according to best-practices within your applied frameworks? Is it understandable and maintainable?

- We followed the AirBnB style guide for React and JavaScript
- We applied best practices for React components, including smaller components and separation of concerns from API logic
- We applied standard best practice on the backend, separating server logic, routing logic, business logic and database logic

### Has your code been tested? How?

- The frontend was tested using Jest snapshot testing
- The backend was tested extensively using Jest and Mock database

### Is there evidence of good project management, and appropriate contribution from all team members?

- We used GitHub issues and Kanban board to track our tasks
- Pull requests can only be merged if at least two team members approve the changes
- Each team member put 100% of their effort on this project. The tasks were delegated evenly and each team member contributed equal amount of work to the project
- We hosted regular team meeting, and keep a high-level communication both synchronously and asynchronously
