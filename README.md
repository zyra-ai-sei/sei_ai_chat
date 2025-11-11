# Project Name

Chaquen Frontend.

## T## Development

This project uses TypeScript. All .ts and .tsx files are compiled into JavaScript using Vite's built-in TypeScript support.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_BASE_CHAIN_ID = 1329
VITE_ALTERNATE_CHAIN_ID = 1329

VITE_BASE_ALCHEMY_KEY = ""
```

These environment variables are required for the application to connect to the Sei blockchain and use the Alchemy API.

## Project-structureof Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Project Structure](#project-structure)
- [Built With](#built-with)
- [Contributing](#contributing)

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
2. Clone this repository:

   ```bash
   git clone https://github.com/mr-shreyansh/sei_ai_chat.git

   ```

3. Navigate to the project directory

   cd your-repo-name

4. Install dependencies:

   npm install/yarn install

## Usage

npm run dev: Starts the development server.
npm run build: Builds the project for production.
npm run preview: Previews the production build.
npm run lint: Runs ESLint to check code quality.
npm run format: Formats the code using Prettier.

## Development

This project uses TypeScript. All .ts and .tsx files are compiled into JavaScript using Vite’s built-in TypeScript support.

## Project-structure

├── public/ # Static assets (publicly served)
├── src/ # Source code
│ ├── assets/ # Images, fonts, and other assets
│ ├── components/ # Reusable components
│ ├── page/ # Page views
│ ├── redux/ # Redux files
│ ├── interface/ # For types and interfaces
│ ├── utils/ # For utility functions
│ ├── enums/ # For enums
│ ├── App.tsx # Main app component
│ ├── main.tsx # Entry point for the application
│ └── ... # Other files
├── tsconfig.json # TypeScript configuration
├── vite.config.ts # Vite configuration
├── package.json # NPM configuration and dependencies
└── README.md # This file

## Built-with

Vite - Next Generation Frontend Tooling
React - JavaScript library for building user interfaces
TypeScript - Typed JavaScript
ESLint - Linting utility for JavaScript/TypeScript
Prettier - Code formatter

## Contributing

Contributions are welcome! Please follow these steps:

Fork the project.
Create a new branch (git checkout -b feature-branch-name).
Make your changes.
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature-branch-name).
Open a pull request.
