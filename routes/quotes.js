const express = require('express')
const router = express.Router()
const db = require('../db')
const utils = require('../utils')

router.get('/all',(request,response)=>{
  const query=`select quotes.quoteId as quoteId, author,quotecontents, quotes.userId,fav.status as status from quotes left join favorites fav on quotes.quoteId = fav.quoteId;`
  db.query(query, (error, quotes) => {
     response.send(utils.createSuccessResult(quotes))
    })
})

router.get('/', (request, response) => {
  const query = `select quoteId,author,quotecontents,userId from quotes where userId = ?`
  db.query(query, [request.user.userId], (error, quotes) => {
    response.send(utils.createResult(error, quotes))
  })
})

router.post('/', (request, response) => {
  const {author, quotecontents } = request.body
  const query = `insert into quotes  (author,quotecontents, userId) values (?,?, ?)`
  db.query(query, [author,quotecontents, request.user.userId], (error, quotes) => {
    response.send(utils.createResult(error, quotes))
  })
})

router.put('/:quoteId', (request, response) => {
  const { quoteId } = request.params
  const { quotecontents } = request.body
  const query = `update quotes set quotecontents= ? where quoteId = ?`
  db.query(query, [quotecontents, quoteId], (error, quotes) => {
    response.send(utils.createResult(error, quotes))
  })
})
router.delete('/:quoteId', (request, response) => {
  const { quoteId } = request.params
  const query = `delete from quotes  where quoteId = ?`
  db.query(query, [quoteId], (error, quotes) => {
    response.send(utils.createResult(error, quotes))
  })
})
router.post('/fav/:quoteId', (request, response) => {
    const { quoteId } = request.params
    const { status,userId } = request.body
    const uquery = `select userId from quotes where quoteId=? `
    db.query(uquery, [quoteId], (error,user ) => {
      if(user[0].userId==userId){  
         response.send(utils.createSuccessResult(user))
      }else{
       const query = `insert into favorites  (quoteId, userId,status) values (?,?,?) `
        console.log(status+ " abcd "+userId)
       db.query(query, [quoteId,userId,status], (error,favorites ) => {
       response.send(utils.createResult(error, favorites))
       })
      }
    })
})

router.get('/fav', (request, response) => {
  const query = `select quotecontents from quotes`
  db.query(query, (error, quotes) => {
    response.send(utils.createResult(error, quotes))
  })
})

router.get('/fav/:userId', (request, response) => {
  const{ userId }=request.params
  const query=`select quotes.quoteId as quoteId, author,quotecontents,fav.status as status from quotes, favorites fav where quotes.quoteId = fav.quoteId and fav.userId=?` 
  db.query(query, [userId], (error, quotes) => {
    response.send(utils.createResult(error, quotes))
  })
})

router.delete('/delfav/:quoteId', (request, response) => {
  const { quoteId } = request.params
  const query = `delete from favorites  where quoteId = ?`
  db.query(query, [quoteId], (error, quotes) => {
    response.send(utils.createResult(error, quotes))
  })
})

module.exports = router
