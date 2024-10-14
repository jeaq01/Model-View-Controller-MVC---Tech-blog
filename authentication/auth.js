'use strict'
import 'dotenv/config'
import hash from 'pbkdf2-password';
import session from 'express-session';
import models from '../models/index.js';

var loggedUser;

function setUpAuthentication(appInstance){
    // middleware        
    appInstance.use(session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: process.env.AUTH_SECRET_SEED,
      }));  
  
    // Session-persisted message middleware
    
    appInstance.use(function(req, res, next){
        var err = req.session.error;
        var msg = req.session.success;
        delete req.session.error;
        delete req.session.success;
        res.locals.message = '';
        if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
        if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
        next();
        });
}  

// Authenticate using our plain-object database of doom!

async function authenticate(name, pass, fn) {
    //Grab the user with the given name/username from the database
    try {
      let user = await models.User.findOne({
        where: {
          username: name,
        },
      });      
      if(user != undefined){        
          hash()({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
            if (err) return fn(err);
            if (hash === user.password){
              loggedUser = {id: user.id, username: user.username};    
              return fn(null, loggedUser);
            } 
            return fn(null, null);
          });
      }
    } catch (error) {
      return fn(null, null);
    }       
  }

async function registerUser(username, password, callback){
    try {
        //Check the user doesn't exist
        //Grab the user with the given name/username from the database
        let queryResults = await models.User.findOne({          
          where: {
            username: username,
          }
        });
        if(queryResults == null){
          hash()({ password: password }, async function (err, pass, salt, hash) {
            if (err){              
              callback(false);
            } 
            // store the salt & hash in the "db"
            let insert = await models.User.create({
              username: username,
              password: hash,
              salt: salt,
            });          
            callback(true);
            return;
          });
        }else{
          callback(false);
        }
    } catch (error) {
      callback(false);
    }    
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

export default {authenticate, restrict, setUpAuthentication, registerUser, loggedUser};