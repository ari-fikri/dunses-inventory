# Dunses Inventory Management

This is a simple inventory management application built with React. It allows users to manage clients and products.

## Local Development Setup

To get the project running on your local machine, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd dunses-inventory
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

To start the development server, run:

```bash
npm start
```

This will open the application at [http://localhost:3000](http://localhost:3000). The page will automatically reload when you make changes to the code.

## Testing

This project uses Cucumber for Behavior-Driven Development (BDD) testing.

### Running BDD Tests

To run the suite of Cucumber tests, use the following command:

```bash
npm run test:bdd
```

This will execute all the feature files in the `features/` directory.

### Code Coverage

We use `nyc` to generate code coverage reports from our tests.

#### Generating a Terminal Report

To run the tests and see a simple coverage summary in your terminal, run:

```bash
npm run test:coverage
```

#### Generating an HTML Report

For a more detailed and interactive report, you can generate it in HTML format.

1.  **Run the coverage command with the HTML reporter:**
    ```bash
    npm run test:coverage
    ```
    *(This is the same command as before, as we've configured it in `package.json` to produce an HTML report by default.)*

2.  **View the report:**
    After the command finishes, a `coverage` directory will be created. Open the `index.html` file inside it to view the detailed report in your browser.
    ```bash
    open coverage/index.html
    ```

## Available Scripts

-   **`npm start`**: Starts the development server.
-   **`npm run build`**: Bundles the app for production.
-   **`npm run test:bdd`**: Runs the Cucumber BDD tests.
-   **`npm run test:coverage`**: Runs the BDD tests and generates a code coverage report.