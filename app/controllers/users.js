const User = require('../model/users')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')

class UsersCtl {
    async find(ctx) {
        let { per_page = 10, page = 0 } = ctx.query
        page = Math.max(+page, 1) - 1
        const perPage = Math.max(+per_page, 1)
        ctx.body = await User.find().limit(perPage).skip(page)
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const populateStr = fields.split(';').filter(f => f).map(f => {
            if (f === 'employments') {
                return 'employments.company employments.job'
            }
            if (f === 'educations') {
                return 'educations.school educations.major'
            }
            return f
        }).join(' ')
        // +locations +employments
        const user = await User.findById(ctx.params.id).select(selectFields).populate(populateStr)
        if (!user) ctx.throw(404, '用户不存在')
        ctx.body = user
    }

    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        })
        const { name } = ctx.request.body
        const repeatedUser = await User.findOne({ name })
        if (repeatedUser) { ctx.throw(409, '用户已存在') }
        ctx.body = await new User(ctx.request.body).save()
    }

    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
        await next()
    }

    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object', required: false },
            educations: { type: 'array', itemType: 'object', required: false },
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) ctx.throw(404, '用户不存在')
        ctx.body = user
    }

    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id)
        if (!user) ctx.throw(404, '用户不存在')
        ctx.status = 204
    }

    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        })
        const user = await User.findOne(ctx.request.body)
        if (!user) { ctx.throw(401, '用户名或密码错误') }
        const { _id, name } = user
        // todo jwt
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '10d' })
        ctx.body = { token }
    }

    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if (!user) { ctx.throw(404, '用户不存在') }
        ctx.body = user.following
    }

    async listFollowers(ctx) {
        ctx.body = await User.find({ following: ctx.params.id })
    }

    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id)
        if (!user) { ctx.throw(404, '用户不存在') }
        await next()
    }

    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        let index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.following.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }

    async listFollowingTopics(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
        if (!user) { ctx.throw(404, '用户不存在') }
        ctx.body = user.followingTopics
    }

    async followTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        if (!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
            me.followingTopics.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async unfollowTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        let index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.followingTopics.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }
}

// db.comment.insertMany([
//     { "_id": "1", "articleid": "100001", "content": "我们不应该把清晨浪费在手机上，健康很重要，一杯温水幸福你我他。", "userid": "1002", "nickname": "相忘于江湖", "createdatetime": new Date("2019-08-05T22:08:15.522Z"), "likenum": NumberInt(1000), "state": "1" },
//     { "_id": "2", "articleid": "100001", "content": "我夏天空腹喝凉开水，冬天喝温开水", "userid": "1005", "nickname": "伊人憔悴", "createdatetime": new Date("2019-08-05T23:58:51.485Z"), "likenum": NumberInt(888), "state": "1" },
//     {"_id": "3", "articleid": "100001", "content": "我一直喝凉开水，冬天夏天都喝。", "userid": "1004", "nickname": "杰克船长","createdatetime":new Date("2019 - 08 - 06T01: 05: 06.321Z"),"likenum":NumberInt(666),"state":"1"},
//     { "_id": "4", "articleid": "100001", "content": "专家说不能空腹吃饭，影响健康。", "userid": "1003", "nickname": "凯撒", "createdatetime": new Date("2019-08-06T08:18:35.288Z"), "likenum": NumberInt(2000), "state": "1" },
//     { "_id": "5", "articleid": "100001", "content": "研究表明，刚烧开的水千万不能喝，因为烫嘴。", "userid": "1003", "nickname": "凯撒", "createdatetime": new Date("2019-08-06T11:01:02.521Z"), "likenum": NumberInt(3000), "state": "1" }
// ]);


module.exports = new UsersCtl()
