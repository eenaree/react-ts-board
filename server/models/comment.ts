import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { dbModels } from '@models';
import User from '@models/user';
import Post from '@models/post';

class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
> {
  declare readonly id: CreationOptional<number>;
  declare comment: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date>;
  declare readonly UserId: ForeignKey<User['id']>;
  declare readonly PostId: ForeignKey<Post['id']>;

  declare addLiker: BelongsToManyAddAssociationMixin<User, number>;
  declare addDisliker: BelongsToManyAddAssociationMixin<User, number>;
  declare removeLiker: BelongsToManyRemoveAssociationMixin<User, number>;
  declare removeDisliker: BelongsToManyRemoveAssociationMixin<User, number>;
  declare addReply: BelongsToManyRemoveAssociationMixin<Comment, number>;

  static initialize(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
        paranoid: true,
      }
    );
  }

  static associate(db: dbModels) {
    db.Comment.belongsTo(db.Post);
    db.Comment.belongsTo(db.User);
    db.Comment.belongsToMany(db.Comment, {
      through: 'reply_comments',
      as: 'replies',
      foreignKey: 'originalCommentId',
    });
    db.Comment.belongsToMany(db.Comment, {
      through: 'reply_comments',
      as: 'originalComments',
      foreignKey: 'replyId',
    });
    db.Comment.belongsToMany(db.User, {
      through: 'like_comments',
      as: 'likers',
    });
    db.Comment.belongsToMany(db.User, {
      through: 'dislike_comments',
      as: 'dislikers',
    });
  }
}

export default Comment;
