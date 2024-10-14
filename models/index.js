import User from './user.js';
import Blog from './blog.js';

// Define associations
//User.hasMany(Blog, { foreignKey: 'blog_user' });
Blog.belongsTo(User, { foreignKey: 'creator_id' });

export default {
  User,
  Blog
};
