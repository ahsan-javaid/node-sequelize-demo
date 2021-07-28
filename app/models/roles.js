const {Sequelize, Model, DataTypes} = require('sequelize');
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      console.log(models);
      Roles.belongsToMany(models.Users, { through: models.Userroles });
    }
  };
  Roles.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    }
  }, {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    },
    modelName: 'roles',
    tableName: 'Roles',
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    sequelize: global.sequelize
  });
  
  module.exports = Roles;
