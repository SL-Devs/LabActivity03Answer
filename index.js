const express = require('express');

// Import the body-parser middleware to parse incoming JSON requests
const bodyParser = require('body-parser');

// Create an instance of an Express application
const app = express();

// Define the port where the server will listen for requests
const PORT = 3000;

// Use body-parser to automatically parse JSON payloads in incoming requests
app.use(bodyParser.json());

// Error-handling middleware: logs errors and sends a 500 response if something goes wrong
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack to the console
    res.status(500).json({ error: 'Something went wrong!' }); // Respond with a generic error message
});

// In-memory array to store user data (for demonstration purposes)
const users = [];

// Route to handle GET requests to '/users' – returns the list of users
app.get('/users', (req, res) => {
    console.log('GET /users endpoint was accessed'); // Log the access to this route
    res.status(200).json(users); // Send the users array as a JSON response
});

// Helper function to validate email format using a regular expression
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for basic email format
    return emailRegex.test(email); // Return true if email matches the regex, false otherwise
};

// Route to handle POST requests to '/register' – for user registration
app.post('/register', (req, res) => {
    // Extract name, email, and password from the request body
    const { name, email, password } = req.body;

    // Check if the email is valid using the helper function
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' }); // Respond with a 400 error if email is invalid
    }

    // Basic validation to check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' }); // Respond with a 400 error if any field is missing
    }

    // Check if the email already exists in the users array
    const userExists = users.some(user => user.email === email); // Returns true if email already exists
    if (userExists) {
        return res.status(400).json({ error: 'Email already exists' }); // Respond with a 400 error if email is not unique
    }

    // If all validations pass, add the new user to the users array
    users.push({ name, email, password });

    // Respond with a 201 status code and success message
    res.status(201).json({ message: 'User registered successfully' });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log a message when the server starts
});
