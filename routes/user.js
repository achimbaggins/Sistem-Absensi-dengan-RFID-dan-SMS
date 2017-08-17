const express = require('express');
const router = express.Router()
const db = require('../models')
const encryptpass = require('../helpers/encryptme');


router.use((req, res, next) => {
  if(req.session.authority === 3){
    next()
  } else {
    res.redirect('/')
  }
})

router.get('/', (req, res) => {
  db.User.findAll({
    order: [['role', 'ASC']]
  })
  .then(dataUser => {
    res.render('user', {dataUser: dataUser, pesan: false})
  })
})

router.post('/', (req, res) => {
  // res.send(req.body)
  if(req.body.username === "" || req.body.password === ""){
    db.User.findAll({
      order: [['role', 'ASC']]
    })
    .then(dataUser => {
      res.render('user', {dataUser: dataUser, pesan: 'Username dan Password tidak boleh kosong!'})
    })
  } else {
    db.User.findAll({
      where: {
        username: req.body.username
      }
    })
    .then(result => {
      if(result.length == 0){
        db.User.create({
          username: req.body.username,
          password: req.body.password,
          role: req.body.role
        })
        .then( () => {
          res.redirect('/users')
        })
      } else {
        db.User.findAll({
          order: [['role', 'ASC']]
        })
        .then(dataUser => {
        res.render('user', {dataUser: dataUser, pesan: 'Username sudah terdaftar, coba yang lain!'})
        })
      }
    })
    .catch( () => {
      db.User.findAll({
        order: [['role', 'ASC']]
      })
      .then(dataUser => {
      res.render('user', {dataUser: dataUser, pesan: 'Username sudah terdaftar, coba yang lain!'})
      })
    })
  }
})

router.get('/edit/:id', (req, res) => {
  if(req.params.id == 1){
    res.redirect('/users')
  } else {
    db.User.findAll({
    where: {
      id: req.params.id
    }
    })
    .then( dataUser => {
      res.render('user-edit', {d: dataUser[0], pesan: false})
    })
  }
})

router.post('/edit/:id', (req, res) => {
  if(req.params.id == 1){
    res.redirect('/users')
  } else {
    let sec = req.body.secret
    let pass = encryptpass(req.body.password, sec)

    db.User.update({
    password: pass,
    role: req.body.role
    },{
      where: {
        id: req.params.id
      }
    })
    .then( () => {
      res.redirect('/users')
    })
  }
})

router.get('/delete/:id', (req, res) => {
  if(req.params.id == 1){
    res.redirect('/users')
  } else {

    db.User.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(()=>{
      res.redirect('/users')
    })
  }
})
module.exports = router;
