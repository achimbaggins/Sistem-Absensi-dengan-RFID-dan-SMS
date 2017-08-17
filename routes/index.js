const express = require('express');
const router = express.Router()
const db = require('../models')
const encryptpass = require('../helpers/encryptme');




router.get('/login', (req, res) => {
  res.render('login', {pesan: false})
})

router.post('/login', (req, res) => {
  // res.send(req.body)
  db.User.findAll({
    where: {
      username: req.body.username
    }
  })
  .then(dataLogin => {
    let sec = dataLogin[0].secret
    let pass = encryptpass(req.body.password, sec)
    // res.send(pass)
    if(dataLogin[0].password == pass){
      req.session.user = dataLogin[0].username,
      req.session.role = dataLogin[0].role

      if(req.session.role === "administrator"){
        req.session.authority = 3;
      } else if (req.session.role === "akademik"){
        req.session.authority = 2;
      } else if (req.session.role === "guru"){
        req.session.authority = 1;
      }
      res.redirect('/')
    } else {
      res.render('login', {pesan: 'Password Salah!!!'})
    }
  })
  .catch( () => {
    res.render('login', {pesan: 'Data Login atau Username tidak dikenal!!!'})
  })
})

router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/login')
})

router.use((req, res, next) => {
  if(req.session.authority > 0){
    next()
  } else {
    res.redirect('/login')
  }
})
router.get('/', (req, res) => {
  res.render('index')
})


module.exports = router
