"use strict";

module.exports = {
  async up(queryInterface) {
    const [subCategories] = await queryInterface.sequelize.query(
      `SELECT id, name FROM sub_categories`
    );

    const mobiles = subCategories.find(s => s.name === "Mobiles");
    const laptops = subCategories.find(s => s.name === "Laptops");

    await queryInterface.bulkInsert("items", [
      {
        name: "iPhone 15",
        price: 79999,
        stock: 10,
        brand: "Apple",
        description: "Latest iPhone",
        sub_category_id: mobiles.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "MacBook Air",
        price: 129999,
        stock: 5,
        brand: "Apple",
        description: "M-series laptop",
        sub_category_id: laptops.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("items", null, {});
  },
};
