import { Sequelize, Model, DataTypes, ModelStatic, InferCreationAttributes, CreationOptional } from "sequelize";
import bcrypt from "bcrypt";

class User extends Model<
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: "admin" | "user";

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;

    // Compare plain password with hashed password
    declare comparePassword: (password: string) => Promise<boolean>;

    static initModel(sequelize: Sequelize): ModelStatic<User> {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                username: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                role: {
                    type: DataTypes.ENUM("admin", "user"),
                    defaultValue: "user",
                    allowNull: false,
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
                tableName: "users",
                timestamps: true,
                paranoid: true,

                defaultScope: {
                    attributes: {
                        exclude: ["password"], // default scope with no password
                    },
                },

                scopes: {
                    withPassword: {
                        attributes: {
                            include: ["password"], // additional scope to include password
                        },
                    },
                },

                hooks: {
                    beforeCreate: async (user: User) => {
                        if (user.password) {
                            user.password = await bcrypt.hash(user.password, 13);
                        }
                    },
                    beforeUpdate: async (user: User) => {
                        if (user.changed("password")) {
                            user.password = await bcrypt.hash(user.password, 13);
                        }
                    },
                },
            }
        );

        return User;
    }
}

// Instance methods
User.prototype.comparePassword = async function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export default User;
