import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import User from './user.model';

class Deposit extends Model {
  public id!: number;
  public user_id!: number;
  public amount!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Deposit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    modelName: 'Deposit',
    timestamps: false,
    tableName: 'Deposits',
  }
);

export default Deposit;
