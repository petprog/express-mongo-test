# Express MongoDB Passport Authentication with Local and Discord Strategies

This project is an Express application with MongoDB integration, featuring authentication using Passport.js with both local and Discord strategies. It also includes comprehensive testing using Jest for unit tests and SuperTest for end-to-end tests.

## Features

- User authentication using Passport.js with local and Discord strategies.
- MongoDB integration for storing user data.
- Unit testing with Jest for individual components.
- End-to-end testing with SuperTest for API endpoints.
- Express middleware for authentication and error handling.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js and npm (or yarn)
- MongoDB (local or remote)
- Discord Developer Account (for setting up OAuth2)

## Getting Started

1. Clone the repository to your local machine:

    ```bash
    git clone <repository-url>
    ```

2. Install dependencies:

    ```bash
    cd your-project-directory
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and configure the following variables:

    ```plaintext
    DATABASE_URI=mongodb://localhost:27017/your-database-name
    SESSION_SECRET=your-session-secret
    DISCORD_CLIENT_ID=your-discord-client-id
    DISCORD_CLIENT_SECRET=your-discord-client-secret
    DISCORD_CALLBACK_URL=your-discord-callback-url
    COOKIE_PARSER_SECRET=your-cookie-parsr-secret
    ```

    Adjust the values based on your configuration.

4. Start the server:

    ```bash
    npm start
    ```

5. Visit `http://localhost:3000` in your browser to access the application.

## Authentication

### Local Authentication

For local authentication, users can register with their email and password.

### Discord Authentication

Users can also log in using their Discord account. This requires setting up a Discord application in the Discord Developer Portal.

## Testing

### Running Tests

To run the unit tests:

```bash
npm run test
```

### Writing Tests
- Unit Tests: Write unit tests using Jest for individual functions, controllers, and middleware.
- End-to-End Tests: Use SuperTest to write end-to-end tests for API endpoints, ensuring the entire application functions correctly.


## Project Structure
-config/: Contains configuration files for Passport, MongoDB, and other environment variables.
- controllers/: Includes controller functions for handling authentication and other routes.
- utils/: Custom middleware functions for authentication and error handling.
- mongoose/schema/: MongoDB schema models.
- routes/: Express route handlers.
- __tests__/: Contains unit tests 
- e2e/: and end-to-end tests.
- utils/: Utility functions used across the application, Custom middleware functions for authentication and error handling
- index.js: Entry point of the application.

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests for new features, bug fixes, or improvements.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
Passport.js documentation
Express documentation
Jest documentation
SuperTest documentation
