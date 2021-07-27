"use strict";

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable("user_roles", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        field: "user_id",
        references: {
          model: "user",
          field: "id",
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        field: "role_id",
        references: {
          model: "roles",
          field: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("user_roles");
  },
};
