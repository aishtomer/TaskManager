const Task = require('../models/tasks');
const session = require('express-session');
const { Sequelize, DataTypes } = require('sequelize');

// Get all tasks for the logged-in user with sorting and filtering options
exports.getTasks = async (req, res) => {
    try {
        const user = req.session.user;
    
        if (!user) {
            // Redirect to login if the user is not logged in
            res.redirect('/users/login');
            return;
        }
  
        // Extract sorting and filtering options from query parameters
        const { sortBy, sortOrder, status, category } = req.query;
  
        // Define options object for Sequelize query
        const options = {
            where: { user_id: user.user_id },
            order: [] // Initialize the order array
        };
  
        // Apply sorting based on user input
        if (sortBy && sortOrder) {
            options.order.push([sortBy, sortOrder.toUpperCase()]);
        }
  
        // Apply filtering based on user input
        if (status) {
            options.where.status = status;
        }
  
        if (category) {
            options.where.category = category;
        }
  
        // Fetch tasks for the logged-in user with sorting and filtering options
        const tasks = await Task.findAll(options);
  
        // Render the tasks view with sorted and filtered tasks
        res.render('tasks', { user, tasks });
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).send('Internal Server Error');
    }
};
  

// Render the form to create a new task
exports.getCreateTask = async (req, res) => {
    res.render('createTask');
};

// Create a new task
exports.postCreateTask = async (req, res) => {
    try {
        const user = req.session.user;

        if (!user) {
            // Redirect to login if the user is not logged in
            res.redirect('/users/login');
            return;
        }

        const { title, description, deadline, priority, status, category} = req.body;
        var user_id = user.user_id;

        // Create a new task for the logged-in user
        await Task.create({
            user_id,
            title,
            description,
            deadline,
            priority,
            status,
            category
        });

        // Redirect back to the tasks page
        res.redirect('/tasks');
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Render the form to update a task
exports.getUpdateTask = async (req, res) => {
    try {
        const user = req.session.user;
        const taskId = req.params.id;
    
        if (!user) {
            // Redirect to login if the user is not logged in
            res.redirect('/users/login');
            return;
        }
  
        // Find the task to update
        const task = await Task.findByPk(taskId);
    
        if (!task || task.user_id !== user.user_id) {
            // Task not found or not authorized to update
            res.status(404).send('Task not found');
            return;
        }
  
        res.render('updateTask', { user, task });
    } catch (error) {
        console.error('Error getting update task form:', error);
        res.status(500).send('Internal Server Error');
    }
};
  
// Update an existing task
exports.postUpdateTask = async (req, res) => {
    try {
        const user = req.session.user;
        const taskId = req.params.id;
        const { title, description, deadline, priority, status, category} = req.body;
  
        if (!user) {
            // Redirect to login if the user is not logged in
            res.redirect('/users/login');
            return;
        }
  
        // Find the task to update
        const taskToUpdate = await Task.findByPk(taskId);
    
        if (!taskToUpdate || taskToUpdate.user_id !== user.user_id) {
            // Task not found or not authorized to update
            res.status(404).send('Task not found');
            return;
        }
  
        // Update the task
        taskToUpdate.title = title;
        taskToUpdate.description = description;
        taskToUpdate.deadline = deadline;
        taskToUpdate.status = status;
        taskToUpdate.priority = priority;
        taskToUpdate.category = category;
    
        await taskToUpdate.save();
    
        // Redirect back to the tasks page
        res.redirect('/tasks');
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const user = req.session.user;

        if (!user) {
            // Redirect to login if the user is not logged in
            res.redirect('/users/login');
            return;
        }

        const taskId = req.params.id;

        // Find the task to delete
        const taskToDelete = await Task.findByPk(taskId);

        if (!taskToDelete || taskToDelete.user_id !== user.user_id) {
            // Task not found or not authorized to delete
            res.status(404).send('Task not found');
            return;
        }

        // Delete the task
        await taskToDelete.destroy();

        // Redirect back to the tasks page
        res.redirect('/tasks');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Search for tasks based on keyword and/or due date
exports.searchTasks = async (req, res) => {
    try {
        const user = req.session.user;
        const { keyword, dueDate } = req.body;

        if (!user) {
            // Redirect to login if the user is not logged in
            res.redirect('/users/login');
            return;
        }

        // Build the search query based on keyword and/or dueDate
        const searchQuery = {
            user_id: user.user_id
        };

        if (keyword) {
            searchQuery.title = { [Sequelize.Op.like]: `%${keyword}%` };
        }

        if (dueDate) {
            searchQuery.deadline = dueDate;
        }

        // Perform the search
        const searchResults = await Task.findAll({
            where: searchQuery
        });

        res.render('tasks', { user, tasks: searchResults, keyword, dueDate });
    } catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
};