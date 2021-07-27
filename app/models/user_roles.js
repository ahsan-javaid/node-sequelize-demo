const { Sequelize, Model, DataTypes } = require("sequelize");

class UserRoles extends Model {
  static associate(models) {}
}
UserRoles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "user_id",
      references: {
        model: "user",
        field: "id",
      },
    },
    roleId: {
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
  },
  {
    defaultScope: {
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    },
    modelName: "user_roles",
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    sequelize: global.sequelize,
  }
);

module.exports = UserRoles;
