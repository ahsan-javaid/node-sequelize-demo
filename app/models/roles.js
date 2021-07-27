const { Sequelize, Model, DataTypes } = require("sequelize");

class Roles extends Model {
  static associate(models) {
    console.log(models);
    Roles.belongsToMany(models.Users, { through: models.UserRoles });
  }
}
Roles.init(
  {
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
  },
  {
    defaultScope: {
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    },
    modelName: "roles",
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    sequelize: global.sequelize,
  }
);

module.exports = Roles;
