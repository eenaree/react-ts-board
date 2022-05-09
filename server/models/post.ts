import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  Sequelize,
  CreationOptional,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
} from 'sequelize';
import { dbModels } from '@models';
import User from '@models/user';

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare readonly id: CreationOptional<number>;
  declare title: string;
  declare contents: string;
  declare views: number | null;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date>;
  declare readonly UserId: ForeignKey<User['id']>;

  declare addRecommender: BelongsToManyAddAssociationMixin<User, number>;
  declare removeRecommender: BelongsToManyRemoveAssociationMixin<User, number>;

  static initialize(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        contents: {
          type: DataTypes.STRING,
        },
        views: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(db: dbModels) {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.User, {
      through: 'post_recommendation',
      as: 'recommenders',
    });
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.File);
  }
}

export default Post;
