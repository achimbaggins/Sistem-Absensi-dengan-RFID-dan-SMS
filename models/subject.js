'use strict';
module.exports = function(sequelize, DataTypes) {
  var Subject = sequelize.define('Subject', {
    name: DataTypes.STRING
  });

  Subject.associate = (models) => {
    Subject.belongsToMany(models.Student, {
      through: 'Attendance'
    })
  }


  return Subject;
};
