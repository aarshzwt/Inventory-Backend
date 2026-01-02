"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("categories", [
      { name: "Electronics", createdAt: new Date(), updatedAt: new Date() },
      { name: "Clothing", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
