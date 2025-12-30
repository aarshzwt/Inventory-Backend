import { Sequelize, Model, DataTypes, ModelStatic, CreationOptional } from "sequelize";

class Subscription extends Model {
    declare id: CreationOptional<number>;
    declare user_id: number;
    declare endpoint: string;
    declare p256dh: string;
    declare auth: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    static initModel(sequelize: Sequelize): ModelStatic<Subscription> {
        Subscription.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
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
                endpoint: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                p256dh: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                auth: {
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
                tableName: "subscriptions",
                timestamps: true,
                paranoid: true,
            }
        );

        return Subscription;
    }

    static associate(models: any) {
        Subscription.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
            onDelete: "CASCADE",
        });

    }
}

export default Subscription;
