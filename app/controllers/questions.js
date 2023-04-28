const Question = require('../model/questions')
const User = require('../model/users')

class QuestionCtl {
    async find(ctx) {
        const { pre_page = 10 } = ctx.query
        const page = Math.max(ctx.query.page * 1, 1) - 1
        const perPage = Math.max(pre_page * 1, 1)
        const q= new RegExp(ctx.query.q)
        ctx.body = await Question.find({$or: [{title: q}, {description: q}]})
            .limit(perPage).skip(page * perPage)
    }

    async checkQuestioner (ctx, next) {
        const {question} = ctx.state
        if (question.questioner.toString() !== ctx.state.user_id) {ctx.throw(403, '没有权限')}
        await next()
    } 

    async chechQuestionExist (ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner')
        if (!question) {ctx.throw(404, '问题不存在')}
        ctx.state.question = question
        await next()
    }

    async findById (ctx) {
        const {fields = ''} = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f)
        const user = await User.findById(ctx.params.id).select(selectFields).populate('questioner')
            .populate('following locations business employments.company employments.job ' +
                'educations.school educations.major')
        if (!user) {ctx.throw(404, '用户不存在')}
        ctx.body = user
    }

    async create(ctx) {
        ctx.verifyParams({
            title: {type: 'string', required: true},
            description: {type: 'string', required: false}
        })
        ctx.body = await new Question({...ctx.request.body, questioner: ctx.state.user_id}).save()
    }

    async update(ctx) {
        ctx.verifyParams({
            title: {type: 'string', required: true},
            description: {type: 'string', required: false}
        })
        await ctx.state.question.update(ctx.request.body)
        ctx.body = ctx.state.question
    }

    async delete(ctx) {
        const question = await question.findByIdAndRemove(ctx.params.id)
        ctx.body = question
    }
}

module.exports = new QuestionCtl()