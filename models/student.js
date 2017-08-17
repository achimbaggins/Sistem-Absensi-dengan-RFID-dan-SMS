'use strict';
module.exports = function(sequelize, DataTypes) {
  var Student = sequelize.define('Student', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    no_hp: DataTypes.STRING,
    rfid: DataTypes.STRING,
    img: DataTypes.STRING
  });

  Student.associate = (models) => {
    Student.belongsToMany(models.Subject, {
      through: 'Attendance'
    })
  }


  return Student;
};
