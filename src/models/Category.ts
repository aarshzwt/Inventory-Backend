import { Sequelize, Model, DataTypes, ModelStatic, CreationOptional } from "sequelize";

class Category extends Model {
    declare id: CreationOptional<number>;
    declare name: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    static initModel(sequelize: Sequelize): ModelStatic<Category> {
        Category.init(
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
                tableName: "categories",
                timestamps: true,
                paranoid: true,
            }
        );

        return Category;
    }

    static associate(models: any) {
        Category.hasMany(models.SubCategory, {
            foreignKey: "category_id",
            as: "subCategories",
            onDelete: "CASCADE",
            hooks: true,
        });

        Category.addHook("beforeDestroy", async (category: any, options: any) => {
            await models.SubCategory.destroy({
                where: { category_id: category.id },
                transaction: options.transaction,
                individualHooks: true,
            });
        });
    }
}

export default Category;
