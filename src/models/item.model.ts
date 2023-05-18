import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import User from './user.model';

class Item extends Model {
  public id!: number;
  public name!: string;
  public start_price!: number;
  public time_window!: number;
  public is_published!: boolean;
  public created_by!: number;
  public published_at: Date | undefined;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    start_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    time_window: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Item',
    timestamps: false,
    tableName: 'items',
  }
);

export default Item;
