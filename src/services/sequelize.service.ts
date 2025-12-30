import dbConfig from "../config/config";
import Category from "../models/Category";
import Item from "../models/Item";
import SubCategory from "../models/SubCategory";
import Subscription from "../models/Subscription";
import User from "../models/User";

const sequelizeService = {
  init: async () => {
    try {
      const appModels = {
        User: User.initModel(dbConfig.db),
        Item: Item.initModel(dbConfig.db),
        Category: Category.initModel(dbConfig.db),
        SubCategory: SubCategory.initModel(dbConfig.db),
        Subscription: Subscription.initModel(dbConfig.db)
      };

      // Associate app models
      Object.values(appModels).forEach((model: any) => {
        if (model.associate) {
          model.associate(appModels);
        }
      });

      dbConfig.db
        .authenticate()
        .then(() => console.log("App database connected..."))
        .catch((err: any) => console.log("Error: " + err));

      // Sync Models
      // dbConfig.db
      //   .sync({ alter: true }) // Automatically update table structure
      //   .then(() => console.log("APP Models synced..."));

    } catch (error) {
      console.log("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

export default sequelizeService;
