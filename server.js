'use strict'

/**
 * Module dependencies.
 */
import 'dotenv/config'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from './authentication/auth.js';
import database from './database/database.js';
import handlebars from 'express-handlebars';
import models from './models/index.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up your static directory (if necessary)
app.use(express.static('public')); 

// config

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'public','views'));
app.use(express.urlencoded())

database.createDatabaseConnection();
database.syncModels();
auth.setUpAuthentication(app);

app.get('/', function(req, res){
  res.redirect('/register');
});

app.get('/register', function(req, res){
    res.render(path.join(__dirname, 'public', 'views', 'register.handlebars'));
});

app.post('/register', async function(req, res){
    auth.registerUser(req.body.username, req.body.password, function(result){
        if(result){
            //The user was created successfully
            res.redirect('/login');
        }else{
            //The user was could not be created
            res.render(path.join(__dirname, 'public', 'views', 'register.handlebars'), {
                message: "Something went wrong.",
            });
        }
    });
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

app.get('/login', function(req, res){
    res.render(path.join(__dirname, 'public', 'views', 'login.handlebars'));
});

app.post('/login', async function (req, res, next) {
  if (!req.body) return res.sendStatus(400)
  await auth.authenticate(req.body.username, req.body.password, function(err, user){
    if (err){
      res.render(path.join(__dirname, 'public', 'views', 'login.handlebars'), {
          message: "Something went wrong.",
      });
    }
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;                
        res.redirect('/home');
      });
    } else {
        res.render(path.join(__dirname, 'public', 'views', 'login.handlebars'), {
            message: 'Invalid Credentials',
        });
    }
  });
});

app.get('/home', async function(req, res){
  //Fetch all the blogs in the database
  try {
    let blogs = [];
    let queryResults = await models.Blog.findAll({
      attributes: ['id', 'title', 'content'],
      include: models.User,
    });
    queryResults.forEach(function(result){
      blogs.push({
        title: result.dataValues.title,
        content: result.dataValues.content,
        creator: result.dataValues.User.username,
      });      
    });
    res.render(path.join(__dirname, 'public', 'views', 'home.handlebars'), {
            blogs: blogs,
          });   
  } catch (error) { 
    return res.status(500).render(path.join(__dirname, 'public', 'views', 'home.handlebars'), {
            blogs: [],
          });
  }      
});

app.get('/post_blog', auth.restrict, function(req, res){
  try {
    res.render(path.join(__dirname, 'public', 'views', 'post_blog.handlebars'), {       
    });    
  } catch (error) {
  }
});

app.post('/post_blog',auth.restrict, async function(req, res){
  if (!req.body) return res.sendStatus(400); 
  try {
    let queryResult = await models.Blog.create({
      title: req.body.title,
      content: req.body.content,
      creator_id: req.session.user.id,
    });
    res.redirect('/home');
  } catch (error) {
    console.log(error)
    res.redirect('/post_blog');
  }  
});

app.listen(3000);
console.log('Express started on port 3000');

export default app;