import sequelize from "../config/databse";
import Category from "../models/Category";
import Item from "../models/Item";
import SubCategory from "../models/SubCategory";
import Subscription from "../models/Subscription";
import User from "../models/User";
import CartItem from "../models/CartItem";
import Cart from "../models/Cart";

const sequelizeService = {
  init: async () => {
    try {
      const appModels = {
        User: User.initModel(sequelize),
        Category: Category.initModel(sequelize),
        SubCategory: SubCategory.initModel(sequelize),
        Item: Item.initModel(sequelize),
        Subscription: Subscription.initModel(sequelize),
        Cart: Cart.initModel(sequelize),
        CartItem: CartItem.initModel(sequelize)
      };

      Object.values(appModels).forEach((model: any) => {
        if (model.associate) {
          model.associate(appModels);
        }
      });

      await sequelize.authenticate();
      console.log("App database connected...");
      // sequelize
      //   .sync({ alter: true }) // Automatically update table structure
      //   .then(() => console.log("APP Models synced... \n Ready to go!"));
    } catch (error) {
      console.error("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

export default sequelizeService;
