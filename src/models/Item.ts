import { Sequelize, Model, DataTypes, ModelStatic, CreationOptional } from "sequelize";

class Item extends Model {
    declare id: CreationOptional<number>;
    declare name: string;
    declare stock: number;
    declare price: number;
    declare image: string | null;
    declare sub_category_id: number;
    declare brand: string | null;
    declare description: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    static initModel(sequelize: Sequelize): ModelStatic<Item> {
        Item.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                price: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: false,
                    validate: {
                        min: 0,
                    },
                },
                stock: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                sub_category_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'sub_categories',
                        key: 'id'
                    },
                    onDelete: "CASCADE",
                },
                brand: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                image: {
                    type: DataTypes.STRING(255),
                    allowNull: true
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
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
                tableName: "items",
                timestamps: true,
                paranoid: true,
            }
        );

        return Item;
    }

    static associate(models: any) {
        Item.addHook("beforeDestroy", async (item: any, options: any) => {
            await models.CartItem.destroy({
                where: { item_id: item.id },
                transaction: options.transaction,
            });
        });

        Item.belongsTo(models.SubCategory, {
            foreignKey: "sub_category_id",
            as: "subCategory",
            onDelete: "CASCADE",
        });

        Item.hasMany(models.CartItem, {
            foreignKey: "item_id",
            as: "cartItems",
        });
    }
}

export default Item;
