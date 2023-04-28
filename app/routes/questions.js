const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router({ prefix: '/questions' })
const { secret } = require('../config')
const {
    find, findById, create, update, delete: del,
    chechQuestionExist, checkQuestioner
} = require('../controllers/questions')

const auth = jwt({ secret })


router.get('/', find)
router.post('/', auth, create)
router.get('/:id', chechQuestionExist, findById)
router.patch('/:id', auth, chechQuestionExist, checkQuestioner, update)
router.delete('/:id', auth, chechQuestionExist, checkQuestioner, del)


module.exports = router