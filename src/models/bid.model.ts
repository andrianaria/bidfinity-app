import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import Item from './item.model';
import User from './user.model';

class Bid extends Model {
  public id!: number;
  public user_id!: number;
  public bid_price!: number;
  public item_id!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Bid.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bid_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    item_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
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
    modelName: 'Bid',
    timestamps: false,
    tableName: 'bids',
  }
);

// Define the association
Bid.belongsTo(Item, { foreignKey: 'item_id' });
Item.hasMany(Bid, { foreignKey: 'item_id' });
Bid.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Bid, { foreignKey: 'user_id' });

export default Bid;
