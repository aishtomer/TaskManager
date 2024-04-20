const { Sequelize, DataTypes } = require("sequelize");

// Define Sequelize instance with database connection details
const sequelize = new Sequelize(
    'taskmanager7860',      // Database name
    'aishtomer',            // Database username
    'Ast@8874635984',       // Database password
    {
        host: 'db4free.net',// Database host
        dialect: 'mysql'    // Database dialect
    }
);

// Authenticate with the database
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

// Define the 'Users' model
const Users = sequelize.define("users",{
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Sync the model with the database to create the 'Users' table
sequelize.sync({force:true}).then(() => {
    console.log('Users table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the 'Users' model
module.exports = Users;