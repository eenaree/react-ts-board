import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
  ForeignKey,
  CreationOptional,
} from 'sequelize';
import { dbModels } from '@models';
import Post from '@models/post';

class File extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
  declare readonly id: CreationOptional<number>;
  declare fileUrl: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly PostId: ForeignKey<Post['id']>;

  static initialize(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        fileUrl: {
          type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'File',
        tableName: 'files',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
      }
    );
  }

  static associate(db: dbModels) {
    db.File.belongsTo(db.Post);
  }
}

export default File;
