var express = require('express');
var router = express.Router();
var db = require('../models')

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.Student.findAll({
    order: [['name']]
  })
  .then(data=>{
    res.render('student', {data:data})
  })
});

router.post('/', (req, res) => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  newdate = year + "/" + month + "/" + day;
  db.Student.create({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    no_hp: req.body.no_hp,
    img: req.body.img,
    rfid: req.body.rfid,
    createdAt: newdate
  })
  .then(()=>{
    res.redirect('/students')
  })
})


router.get('/edit/:id', (req, res) => {
  db.Student.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(data => {
    res.render('student-edit', {data:data[0]})
  })
})


router.post('/edit/:id', (req, res) => {
  db.Student.update({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    no_hp: req.body.no_hp,
    img: req.body.img,
    rfid: req.body.rfid
  },{
    where: {
      id: req.params.id
    }
  })
  .then(()=>{
    res.redirect('/students')
  })
})

router.get('/delete/:id', (req, res) => {
  db.Student.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(()=>{
    db.Attendance.destroy({
      where: {
        StudentId: req.params.id
      }
    })
    .then(()=>{
      res.redirect('/students')
    })
  })
})

module.exports = router;
