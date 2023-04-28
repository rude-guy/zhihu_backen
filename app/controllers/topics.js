const Topic = require('../model/topics')
const User = require('../model/users')

class TopicsCtl {
    async find (ctx) {
        let {per_page = 10, page = 0} = ctx.query
        page = Math.max(+page , 1) - 1
        const perPage = Math.max(+per_page, 1)
        ctx.body = await Topic.find({
            name: new RegExp(ctx.query.q)
        }).limit(perPage).skip(page * perPage)
    }

    async checkTopicExist (ctx, next) {
        const topic = await Topic.findById(ctx.params.id)
        if (!topic) {ctx.throw(404, '话题不存在')}
        await next()
    }

    async findById (ctx) {
        const {fields = ''} = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f)
        const user = await User.findById(ctx.params.id).select(selectFields)
            .populate('following locations business employments.company employments.job ' +
                'educations.school educations.major')
        if (!user) {ctx.throw(404, '用户不存在')}
        ctx.body = user
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        })
        ctx.body = await new Topic(ctx.request.body).save()
    }

    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        })
        ctx.body = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    }

    async listFollowers (ctx) {
        ctx.body = await User.find({followingTopics: ctx.params.id})
    }
}

module.exports = new TopicsCtl()
