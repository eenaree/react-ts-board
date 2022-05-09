import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import * as bcrypt from 'bcrypt';
import { dbModels } from '@models';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare readonly id: CreationOptional<number>;
  declare nickname: string;
  declare email: string;
  declare password: CreationOptional<string>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static initialize(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nickname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
      }
    );
  }

  static associate(db: dbModels) {
    db.User.hasMany(db.Post);
    db.User.belongsToMany(db.Post, {
      through: 'post_recommendation',
      as: 'recommends',
    });
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Comment, {
      through: 'like_comments',
      as: 'likes',
    });
    db.User.belongsToMany(db.Comment, {
      through: 'dislike_comments',
      as: 'dislikes',
    });
  }

  async getHashedPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async getPasswordComparedResult(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}

export default User;
