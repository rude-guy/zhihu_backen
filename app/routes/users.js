const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({prefix: '/users'})
const {secret} = require('../config')
const {
    create, find, findById, update,
    delete: del, login,
    checkOwner, checkUserExist,
    listFollowers, listFollowing,
    follow, unfollow, followTopic, unfollowTopic,
    listFollowingTopics
} = require('../controllers/users')

const {checkTopicExist} = require('../controllers/topics')

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
router.get('/:id/following', listFollowing)
router.get('/:id/followers', listFollowers)
router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unfollow)
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic)
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic)
router.get('/:id/listFollowingTopics', listFollowingTopics)

module.exports = router
