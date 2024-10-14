drop database if exists tech_database;
create database tech_database;
\c tech_database;

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
  username varchar(100) DEFAULT NULL,
  password varchar(500) DEFAULT NULL,
  salt varchar(500) DEFAULT NULL,
  id SERIAL bigint PRIMARY KEY NOT NULL,
  
);

CREATE TABLE Blogs (
  title varchar(100) DEFAULT NULL,
  content varchar(1000) DEFAULT NULL,
  id SERIAL bigint NOT NULL,
  creator_id bigint NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT blog_user FOREIGN KEY (creator_id) REFERENCES Users (id)
);

