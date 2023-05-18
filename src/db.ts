require('dotenv').config(); 
const { Sequelize } = require('sequelize');

// Set up database connection
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

export default sequelize;
