class HomeCtl {
    index (ctx) {
        ctx.body = '主体'
        ctx.throw(412, '错误')
    }
}

module.exports = new HomeCtl()
