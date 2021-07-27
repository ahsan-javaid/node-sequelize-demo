"use strict";
module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable("roles", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
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
    return queryInterface.dropTable("roles");
  },
};
