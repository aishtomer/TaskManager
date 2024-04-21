const { Sequelize, DataTypes } = require("sequelize");
const User = require("./users");

// Define Sequelize instance with database connection details
const sequelize = new Sequelize(
    'sql8700522',      // Database name
    'sql8700522',      // Database username
    'ZL8DvjS3VH',      // Database password
    {
        host: 'sql8.freemysqlhosting.net',// Database host
        dialect: 'mysql'    // Database dialect
    }
);

// Authenticate with the database
sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

// Define the 'Tasks' model
const Tasks = sequelize.define("tasks",{
    task_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
      },
    description: {
        type: DataTypes.STRING
    },
    deadline: {
        type: DataTypes.DATEONLY
    },
    priority: {
        type: DataTypes.STRING,
        defaultValue: 'High'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Not Started'
    },
    category: {
        type: DataTypes.STRING,  
        defaultValue: 'Personal'          
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
})

// Define association between User and Tasks models
User.hasMany(Tasks,{
    foreignKey:"user_id"
});
Tasks.belongsTo(User);

// Sync the model with the database to create the 'Tasks' table
sequelize.sync().then(() => {
    console.log('Task table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

// Export the 'Tasks' model
module.exports = Tasks;