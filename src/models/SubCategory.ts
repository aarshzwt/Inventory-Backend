import { Sequelize, Model, DataTypes, ModelStatic, CreationOptional } from "sequelize";

class SubCategory extends Model {
    declare id: CreationOptional<number>;
    declare name: string;
    declare category_id: number;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    static initModel(sequelize: Sequelize): ModelStatic<SubCategory> {
        SubCategory.init(
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
                category_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'categories',
                        key: 'id'
                    },
                    onDelete: "CASCADE",
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
                tableName: "sub_categories",
                timestamps: true,
                paranoid: true,
            }
        );

        return SubCategory;
    }

    static associate(models: any) {
        SubCategory.belongsTo(models.Category, {
            foreignKey: "category_id",
            as: "category",
            onDelete: "CASCADE",
        });

        SubCategory.hasMany(models.Item, {
            foreignKey: "sub_category_id",
            as: "items",
            onDelete: "CASCADE",
            hooks: true,
        });
    }
}

export default SubCategory;
