const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    'taskmanager7860',
    'aishtomer',
    'Ast@8874635984',
    {
        host: 'db4free.net',
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'very-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const userRoutes = require('./routes/user_routes');
app.use('/users', userRoutes);

const taskRoutes = require('./routes/task_routes');
app.use('/', taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});