const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/users' })
const { secret } = require('../config')
const {
    create, find, findById, update,
    delete: del, login, checkOwner
} = require('../controllers/users')


const auth = jwt({secret})
// const auth = async (ctx, next) => {
//     const {authorization = ''} = ctx.request.header
//     const token = authorization.replace('Bearer ', '')
//     try {
//         ctx.state.user = jsonwebtoken.verify(token, secret)
//     } catch (err) {
//         ctx.throw(401, err.message)
//     }
//     await next()
// }

router.get('/', find)

router.post('/', create)

router.get('/:id', findById)

router.patch('/:id', auth, checkOwner, update)

router.delete('/', auth, checkOwner, del)

router.post('/login', login)

module.exports = router
