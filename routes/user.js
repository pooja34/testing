const express = require('express')
const router = express.Router()
const db = require('../db')
const cryptoJs = require('crypto-js')
const utils = require('../utils')
const jwt = require('jsonwebtoken')
const config = require('../config')
const multer = require('multer')
const upload = multer({ dest: 'images' })

router.post(
  '/upload-profile-image',
  upload.single('image'),
  (request, response) => {
    const query = `update user set profileImage = ? where id =?`
    db.query(
      query,
      [request.file.filename, request.user.id],
      (error, result) => {
        response.send(utils.createResult(error, result))
      }
    )
  }
)

router.post('/signup', (request, response) => {
  const { firstName, lastName, email, password } = request.body

  const encryptedPassword = String(cryptoJs.SHA1(password))
  const query = `insert into user (firstName, lastName, email, password) values (?, ?, ?, ?)`
  db.query(
    query,
    [firstName, lastName, email, encryptedPassword],
    (error, result) => {
      response.send(utils.createResult(error, result))
    }
  )
})

router.post('/signin', (request, response) => {
  const { email, password } = request.body

  const encryptedPassword = String(cryptoJs.SHA1(password))
  const query = `select userId, firstName, lastName from user where email = ? and password = ?`
  
  db.query(query, [email, encryptedPassword], (error, users) => {
    if (error) {
      response.send(utils.createErrorResult(error))
    } else if (users.length === 0) {
      response.send(utils.createErrorResult('user not found'))
    } else {
      const { firstName, lastName, userId } = users[0]
      console.log("query "+userId)

      const payload = { firstName, lastName, userId }
      const token = jwt.sign(payload, config.secret)
      response.send(
        utils.createSuccessResult({
          firstName,
          lastName,
          userId,
          token,
         
        })
      )
    }
  })
})
router.get('/', (request, response) => {
 
  console.log(request.user.userId)
   const query = `select firstName, lastName,email,address,phoneNo from user where userId = ?`
   db.query(query, [request.user.userId], (error, quotes) => {
     response.send(utils.createResult(error, quotes))
   })
 })

 router.put('/updateprofile', (request, response) => {
  const{ firstName,lastName,email,address,phoneNo }=request.body
  console.log(request.user.userId)
  console.log("all data "+firstName+" "+lastName+" "+email+" "+address+" "+phoneNo)
   const query = `update user set firstName=?, lastName=?,email=?,address=?,phoneNo=? where userId = ?`
   db.query(query, [firstName,lastName,email,address,phoneNo,request.user.userId], (error, quotes) => {
     response.send(utils.createResult(error, quotes))
   })
 })

module.exports = router
