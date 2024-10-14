import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

// Define the User model
const User = sequelize.sequelize.define('User', {
  // Model attributes
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  // Other model options
  tableName: 'users',
  createdAt: false,
  updatedAt: false,
});

export default User;