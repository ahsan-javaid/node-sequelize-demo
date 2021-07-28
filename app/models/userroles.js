'use strict';
const {Sequelize, Model, DataTypes} = require('sequelize');

  class userRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userRoles.init({
    userID: {
      type: DataTypes.INTEGER,
      field: "user_id",
      references: {
        model: "user",
        field: "id",
      },
    },
    roleID: {
      type: DataTypes.INTEGER,
      field: "role_id",
      references: {
        model: "Roles",
        field: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      modelName: 'userRoles',
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      sequelize: global.sequelize
  });

  module.exports = userRoles;