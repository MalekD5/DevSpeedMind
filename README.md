# DevSpeedMind
Dev mind speed is a game where players solve math equations by calling APIs using Postman or any other API development platform. The game tests the player's speed in answering math problems.

This repository was submitted as part of requirements for CIRCA task.

## Getting Started

### Prerequisites

-   Node.js 16+
-   MySQL v8+
-   Typescript v5+

### Installation

1.  Clone the repository

```bash
git clone https://github.com/malekd5/DevSpeedMind.git
```

2.  Install dependencies

```bash
npm install
```

3.  Create a `.env` file in the root directory and add the following variables:

```bash
SERVER_PORT=
DATABASE_URL=
SERVER_URL= # base url, used for generating the submit URL
```

4. create the database first and then push the schema via:

```bash
npm run db:push
```

4.  Run the server

```bash
npm run dev
```

5.  the server now should be running on `http://localhost:{SERVER_PORT}`

## Usage

### Start a game

To start a game, you need to send a `POST` request to the `/game/start` endpoint with the following body:

```json
{
  "name": "John",
  "difficulty": 3
}
```

The `name` field is required and should be a string with a minimum length of 3 and a maximum length of 30. The `difficulty` field is also required and should be a number between 1 and 4.

If the request is successful, the server will return a response with the following format:

```json
{
	"message": "Hello john, find your submit API URL below",
	"submit_url": "http://localhost:3000/game/astonishing-rainbow-726/submit",
	"question": "(-4)+(-1)",
	"time_started": "2025-02-15T19:18:15.738Z"
}
```

- The `message` field contains a greeting message with the player's name, and the `submit_url` field contains the URL of the submit endpoint for the game.
- The `question` field contains the question that the player needs to solve.
- The `time_started` field contains the time when the request was initiated.
- The `submit_url` field contains the URL of the submit endpoint for the game.

### Submit a game

To submit a game, you need to send a `POST` request to the `/game/:game_id/submit` endpoint with the following body:

```json
{
  "answer": 2
}
```

The `answer` field is required and should be a number.

If the request is successful, the server will return a response with the following format:

```json
{
	"message": "Good job john, your answer is correct!",
	"time_taken": 1.001,
	"current_score": "1/1",
	"history": []
}
```

- The `message` field contains a message indicating whether the player's answer was correct or incorrect.
- The `time_taken` field contains the time taken by the player to answer the question (in seconds).
- The `current_score` field contains the current score of the player (right answers/total questions).
- The `history` field contains an array of previous attempts made by the player (question, player's answer, time taken to answer).

### Get game status

To get the status of a game, you need to send a `GET` request to the `/game/:game_id/status` endpoint.

If the request is successful, the server will return a response with the following format:

```json
{
	"name": "John",
	"difficulty": 3,
	"current_score": "1/1",
	"total_time_spent": 1.001,
	"history": [
		{
			"question": "(-4)+(-1)",
			"answer": "2",
			"time_taken": 1.001
		}
	]
}
```

- The `name` field contains the name of the player.
- The `difficulty` field contains the difficulty of the game.
- The `current_score` field contains the current score of the player.
- The `total_time_spent` field contains the total time spent by the player.
- The `history` field contains an array of previous attempts made by the player.

## Design decisions

### Game Logic
when the player starts a game for the first time, it creates a database record in `game_sessions` table with the player's name and it stores some information such as score, attempts, total time, etc. it also inserts a question into the database `questions` table.

when the player submits a game, it updates the database record with the player's score, attempts, total time, etc. it also marks the question as attempted and stores the time taken by the player. this prevents the player from submitting the same question twice.

when a player starts another game with the same name, it returns the same database record from `game_sessions` table. 
it also inserts a new question into the database `questions` table and asks them to solve the same question. This helps us to keep track of the history of the game.

### Database schema

The database schema is defined in the `database/schema.ts` file. It includes the following tables:

- `game_sessions`: This table stores information about the game sessions, such as the player's name, score, attempts, total time, etc.
- `questions`: This table stores information about the questions, such as the question, answer, attempted, createdAt, timeTaken, etc.

### API endpoints

The API endpoints are defined in the `routers/game.routes.ts` file. It includes the following routes:

- `/game/start`: This route starts a new game session.
- `/game/:game_id/submit`: This route submits the answer to the game.
- `/game/:game_id/status`: This route returns the status of the game.

### Slugs instead of IDs

Instead of using IDs to identify game sessions and questions, slugs are used. This is done purely to make the game id more readable and easier to remember. The slugs are generated using the `random-word-slugs` package.

### TreeShaking and Math.js

The `mathjs` package is used to perform mathematical operations. This package provides a wide range of mathematical functions and constants that can be used in the game. However, we only use the `evaluate` function from this package to evaluate the mathematical expressions. so we made a custom class `math.ts` that allows us to only add the necessary functions to the `evaluate` function. Because the game constraints us to use only 4 operations, we only add those 4 dependencies to the `evaluate` function. 

This is done to reduce the size of the bundle and make the distribution more lightweight.

### Zod

Zod is used to validate the input data. It provides a powerful and flexible validation library for TypeScript and JavaScript.


### Drizzle ORM and Drizzle Kit

Drizzle ORM is used to interact with the database. It provides a simple and intuitive way to interact with databases using TypeScript. We also use Drizzle Kit to generate the database schema and migrations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
