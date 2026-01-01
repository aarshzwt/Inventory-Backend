import { Sequelize, Model, DataTypes, ModelStatic, CreationOptional } from "sequelize";
import Cart from "./Cart";
import Item from "./Item";

class CartItem extends Model {
    declare id: CreationOptional<number>;
    declare cart_id: number;
    declare item_id: number;
    declare quantity: number;
    declare price: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare cart?: Cart;
    declare item?: Item

    static initModel(sequelize: Sequelize): ModelStatic<CartItem> {
        CartItem.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                cart_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "carts",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                },
                item_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "items",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 1,
                    },
                },
                price: {
                    // snapshot price at the time of adding to cart
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                deletedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: null,
                },
            },
            {
                sequelize,
                tableName: "cart_items",
                timestamps: true,
                paranoid: true,
            }
        );

        return CartItem;
    }

    static associate(models: any) {
        CartItem.belongsTo(models.Cart, {
            foreignKey: "cart_id",
            as: "cart",
        });

        CartItem.belongsTo(models.Item, {
            foreignKey: "item_id",
            as: "item",
        });
    }
}

export default CartItem;
