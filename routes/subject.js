var express = require('express');
var router = express.Router();
var db = require('../models')
var Nexmo = require('nexmo');

var nexmo = new Nexmo({
  apiKey: '4ae39e9a',
  apiSecret: 'ef392505ed0e58cc',
});

router.use((req, res, next) => {
  if(req.session.authority > 0){
    next()
  } else {
    res.redirect('/login')
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.Subject.findAll({
    order: [['name']]
  })
  .then(data=>{
    res.render('subject', {data:data})
  })
});

router.post('/', (req, res) => {
  db.Subject.create({
    name: req.body.name
  })
  .then(()=>{
    res.redirect('/subjects')
  })
})

router.get('/edit/:id', (req, res) => {
  db.Subject.findAll({
    where: {
      id: req.params.id
    }
  })
  .then(data=>{
    res.render('subject-edit', {data: data[0]})
  })
})

router.post('/edit/:id', (req, res) => {
  db.Subject.update({
    name: req.body.name
  },{
    where: {
      id: req.params.id
    }
  })
  .then(()=>{
    res.redirect('/subjects')
  })
})

router.get('/delete/:id', (req, res) => {
  db.Subject.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(()=>{
    db.Attendance.destroy({
      where: {
        SubjectId: req.params.id
      }
    })
    .then(()=>{
      res.redirect('/subjects')
    })
  })
})

router.get('/:id/isi-presensi', (req, res)=> {
  db.Attendance.findAll({
    order: [['createdAt', 'DESC']],
    where: {
      SubjectId: req.params.id,
      createdAt: {
        $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
      }
  }, include: [{all: true}]
  })
  .then(data => {
    db.Student.findAll()
    .then(dataStudent => {
      // res.send(data)
      res.render('presensi', {data:data, dataStudent: dataStudent, subid: req.params.id, pesan: false})

    })
  })
  .catch(err => {
    res.send(err)
  })
})

router.post('/:id/isi-presensi', (req, res) => {
  // res.send(req.body)
  db.Student.find({
    where: {
      rfid: req.body.rfid
    }
  })
  .then(data => {
    if(data == null){
      db.Attendance.findAll({
        order: [['createdAt', 'DESC']],
        where: {
          SubjectId: req.params.id,
          createdAt: {
            // $lt: new Date(),
            $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
          }
        } , include: [{all: true}]
      })
      .then(data => {
        db.Student.findAll()
        .then(dataStudent => {
          res.render('presensi', {data:data, dataStudent: dataStudent, subid: req.params.id, pesan: 'Kartu tidak terdaftar dalam sistem, Silahkan kontak administrator'})

        })
      })

    } else {
      db.Attendance.findAll({
        where: {
          StudentId: data.dataValues.id,
          SubjectId: req.params.id,
          createdAt: {
            $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
            // $gte: new Date()
          }
        }
      })
      .then(cekdata => {
        // console.log(cekdata);
        if(cekdata.length == 0){

          db.Attendance.create({
            StudentId: data.dataValues.id,
            SubjectId: req.params.id,
            UserId: 1,
            Status: 'Hadir',
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .then((result)=>{
            // res.send(result.dataValues.id)

            db.Student.find({
              where: {
                id: result.dataValues.StudentId
              }
            })
            .then(dataSMS => {

              db.Subject.find({
                where: {
                  id: result.dataValues.SubjectId
                }
              })
              .then(dataSMSsub => {
                var from = 'SMA Hacktiv8';
                var to = `${dataSMS.dataValues.no_hp}`
                var text = `Anak Bapak/Ibu ${dataSMS.dataValues.name} sudah hadir pada Mata Pelajaran ${dataSMSsub.dataValues.name}`;
                // console.log(dataSMSsub.dataValues.name);
                nexmo.message.sendSms(from, to, text);
                res.redirect(`/subjects/${req.params.id}/isi-presensi`)
              })
            })
          })
          .catch(err=>{
            res.send(err)
          })
        } else {
          db.Attendance.findAll({
            order: [['createdAt', 'DESC']],
            where: {
              SubjectId: req.params.id,
              createdAt: {
                // $lt: new Date(),
                $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
              }
            },
            include: [{all: true}]

          })
          .then(data => {
            db.Student.findAll()
            .then(dataStudent => {
              res.render('presensi', {data:data, dataStudent: dataStudent, subid: req.params.id, pesan: 'Siswa sudah melakukan absensi'})

            })
          })
        }
      })
    }
  })
})


router.get('/:id/data-absensi', (req, res) => {
  // db.query('SELECT * FROM Attendance LEFT JOIN Students ON Attendance.StudentId = Students.id ', { type: db.QueryTypes.SELECT}).then(dataAbsen => {
  // res.send(dataAbsen)
  // })
  db.Student.findAll({
    include: [db.Attendance]
  },{
    where: {
      SubjectId: req.params.id,
      StudentId: null,
      createdAt: {
        // $lt: new Date(),
        $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
      }
    }
  })
  .then(ok => {
    res.render('data-absensi', {ok:ok})
  })
})


module.exports = router;
