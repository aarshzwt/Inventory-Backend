"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Category → SubCategory
        await queryInterface.addConstraint("sub_categories", {
            fields: ["category_id"],
            type: "foreign key",
            name: "fk_sub_categories_category_id",
            references: {
                table: "categories",
                field: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // SubCategory → Item
        await queryInterface.addConstraint("items", {
            fields: ["sub_category_id"],
            type: "foreign key",
            name: "fk_items_sub_category_id",
            references: {
                table: "sub_categories",
                field: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // User → Subscription
        await queryInterface.addConstraint("subscriptions", {
            fields: ["user_id"],
            type: "foreign key",
            name: "fk_subscriptions_user_id",
            references: {
                table: "users",
                field: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            "sub_categories",
            "fk_sub_categories_category_id"
        );

        await queryInterface.removeConstraint(
            "items",
            "fk_items_sub_category_id"
        );

        await queryInterface.removeConstraint(
            "subscriptions",
            "fk_subscriptions_user_id"
        );
    },
};
