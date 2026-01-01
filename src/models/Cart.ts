import { Sequelize, Model, DataTypes, ModelStatic, CreationOptional } from "sequelize";
import Item from "./Item";
import CartItem from "./CartItem";

class Cart extends Model {
    declare id: CreationOptional<number>;
    declare user_id: number;
    declare status: "active" | "checked_out";
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare items: CartItem[];
    declare item: Item;

    static initModel(sequelize: Sequelize): ModelStatic<Cart> {
        Cart.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                },
                status: {
                    type: DataTypes.ENUM("active", "checked_out"),
                    allowNull: false,
                    defaultValue: "active",
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
                tableName: "carts",
                timestamps: true,
                paranoid: true,
            }
        );

        return Cart;
    }

    static associate(models: any) {
        Cart.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });

        Cart.hasMany(models.CartItem, {
            foreignKey: "cart_id",
            as: "items",
            onDelete: "CASCADE",
            hooks: true,
        });
    }
}

export default Cart;
