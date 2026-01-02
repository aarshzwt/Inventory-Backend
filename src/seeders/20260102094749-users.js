"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        username: "admin",
        email: "admin@gmail.com",
        password: "admin123", // hash via model hook if enabled
        role: "admin",
      },
      {
        username: "user",
        email: "user@gmail.com",
        password: "user123",
        role: "user",
      },
    ];

    for (const user of users) {
      const [existing] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = :email LIMIT 1`,
        {
          replacements: { email: user.email },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert("users", [
          {
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }
    }

    console.log("Users seed completed");
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: ["admin@gmail.com", "user@gmail.com"],
    });
  },
};
