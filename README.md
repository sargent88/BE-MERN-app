# My Node.js App

This is a basic Node.js application using Express.

## Project Structure

```
my-nodejs-app
├── src
│   ├── app.js
│   ├── controllers
│   │   └── index.js
│   ├── routes
│   │   └── index.js
│   └── models
│       └── index.js
├── package.json
├── .gitignore
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd my-nodejs-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

You will need a Google Maps API key. Create an API key and add it locally to your repo in a `.env` file (called `GOOGLE_API_KEY`).

You will also need a MongoDB. Create a DB and add you connection string to your repo in a `.env` file (called `MONGODB_URI`)

To start the application, run:

```
npm run dev
```

The application will be running on `http://localhost:3000`.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.
