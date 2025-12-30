import sequelize from "../config/databse";
import Category from "../models/Category";
import Item from "../models/Item";
import SubCategory from "../models/SubCategory";
import Subscription from "../models/Subscription";
import User from "../models/User";

const sequelizeService = {
  init: async () => {
    try {
      const appModels = {
        User: User.initModel(sequelize),
        Category: Category.initModel(sequelize),
        SubCategory: SubCategory.initModel(sequelize),
        Item: Item.initModel(sequelize),
        Subscription: Subscription.initModel(sequelize),
      };

      Object.values(appModels).forEach((model: any) => {
        if (model.associate) {
          model.associate(appModels);
        }
      });

      await sequelize.authenticate();
      console.log("App database connected...");
    } catch (error) {
      console.error("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

export default sequelizeService;
