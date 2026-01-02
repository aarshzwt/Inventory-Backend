"use strict";

module.exports = {
  async up(queryInterface) {
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id, name FROM categories`
    );

    const electronics = categories.find(c => c.name === "Electronics");
    const clothing = categories.find(c => c.name === "Clothing");

    await queryInterface.bulkInsert("sub_categories", [
      {
        name: "Mobiles",
        category_id: electronics.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Laptops",
        category_id: electronics.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Men",
        category_id: clothing.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("sub_categories", null, {});
  },
};
