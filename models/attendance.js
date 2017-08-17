'use strict';
module.exports = function(sequelize, DataTypes) {
  var Attendance = sequelize.define('Attendance', {
    StudentId: DataTypes.INTEGER,
    SubjectId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    Status: DataTypes.STRING
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Student)
    Attendance.belongsTo(models.Subject)
  }


  return Attendance;
};
