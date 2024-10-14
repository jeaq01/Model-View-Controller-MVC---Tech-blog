import 'dotenv/config'
import { Sequelize } from 'sequelize';


// Create a new Sequelize instance
let sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,        
});

function createDatabaseConnection(){
    sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,        
      });
}

// Sync all defined models to the DB
const syncModels = async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing models:', error);
    }
  };

export default {sequelize, syncModels, createDatabaseConnection};