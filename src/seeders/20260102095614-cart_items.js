"use strict";

module.exports = {
  async up(queryInterface) {
    const [carts] = await queryInterface.sequelize.query(
      `SELECT id FROM carts LIMIT 1`
    );
    const [items] = await queryInterface.sequelize.query(
      `SELECT id, price FROM items LIMIT 1`
    );

    await queryInterface.bulkInsert("cart_items", [
      {
        cart_id: carts[0].id,
        item_id: items[0].id,
        quantity: 1,
        price: items[0].price,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("cart_items", null, {});
  },
};
