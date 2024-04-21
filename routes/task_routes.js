const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task_controller');
const homeController = require('../controllers/home_controller');

// Middleware to check if the user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        // Redirect to login if the user is not logged in
        res.redirect('/users/login');
    }
};

// Routes for tasks
router.get('/tasks', isAuthenticated, taskController.getTasks);
router.get('/tasks/create', isAuthenticated, taskController.getCreateTask);
router.post('/tasks/create', isAuthenticated, taskController.postCreateTask);
router.get('/tasks/:id/update', isAuthenticated, taskController.getUpdateTask);
router.post('/tasks/:id/update', isAuthenticated, taskController.postUpdateTask);
router.post('/tasks/:id/delete', isAuthenticated, taskController.deleteTask);

// Home page route
router.get('/', isAuthenticated, homeController.getHomePage);

// Search tasks route
router.post('/tasks/search', isAuthenticated, taskController.searchTasks);

module.exports = router;