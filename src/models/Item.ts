import { Sequelize, Model, DataTypes, ModelStatic, CreationOptional } from "sequelize";

class Item extends Model {
    declare id: CreationOptional<number>;
    declare name: string;
    declare stock: number;
    declare sub_category_id: number;
    declare brand: string | null;
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
                    }
                },
                brand: {
                    type: DataTypes.STRING,
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
        Item.belongsTo(models.SubCategory, {
            foreignKey: "sub_category_id",
            as: "subCategory",
        });
    }
}

export default Item;
