'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reviews.belongsTo(models.User, { foreignKey: 'userId' });
      Reviews.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Reviews.hasMany(models.ReviewImages, { foreignKey: 'reviewId' })
    }
  }
  Reviews.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    review: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reviews',
  });
  return Reviews;
};
