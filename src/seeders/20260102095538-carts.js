"use strict";

module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role='admin' LIMIT 1`
    );

    await queryInterface.bulkInsert("carts", [
      {
        user_id: users[0].id,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("carts", null, {});
  },
};
