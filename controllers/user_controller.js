const bcrypt = require('bcrypt');
const User = require('../models/users');

// Render the registration form
exports.getRegister = (req, res) => {
    res.render('register');
};

// Process registration form submission
exports.postRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Set the user in the session
        req.session.user = newUser;

        // Redirect to the home page or user dashboard
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Render the login form
exports.getLogin = (req, res) => {
    res.render('login');
};

// Process login form submission
exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ where: { username } });

        // Check if the user exists and the password is correct
        if (user && await bcrypt.compare(password, user.password)) {
            // Set the user in the session
            req.session.user = user;

            // Redirect to the home page or user dashboard
            res.redirect('/');
        } else {
            // Render the login page with an error message
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Logout the user and destroy the session
exports.logout = (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy(() => {
        // Redirect to the login page or home page
        res.render('login');
    });
};