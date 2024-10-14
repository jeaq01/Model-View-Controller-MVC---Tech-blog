import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import User from './user.js';

// Define the Blog model
const Blog = sequelize.sequelize.define('Blog', 
{
  // Model attributes
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creator_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
},
{
  // Other model options
  tableName: 'blogs',
  createdAt: false,
  updatedAt: false,
},);

export default Blog;