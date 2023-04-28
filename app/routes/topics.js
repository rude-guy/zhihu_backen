const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/topics'})
const {secret} = require('../config')
const {
    create, find, findById, update,
    checkTopicExist, listFollowers
} = require('../controllers/topics')

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
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, update)
router.get('/:id/followers', checkTopicExist, listFollowers)

module.exports = router
