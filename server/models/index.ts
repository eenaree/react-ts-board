'use strict';

import { Sequelize } from 'sequelize';
import dbConfig from '@config/config';
import User from '@models/user';
import Post from '@models/post';
import Comment from '@models/comment';
import File from '@models/file';

const env =
  (process.env.NODE_ENV as 'production' | 'development' | 'test') ||
  'development';
const config = dbConfig[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export const models = {
  User: User.initialize(sequelize),
  Post: Post.initialize(sequelize),
  Comment: Comment.initialize(sequelize),
  File: File.initialize(sequelize),
};

export type dbModels = typeof models;

Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});
