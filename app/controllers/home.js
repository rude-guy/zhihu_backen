const path = require('path')
class HomeCtl {
    index (ctx) {
        ctx.body = '主体'
        ctx.throw(412, '错误')
    }
    upload (ctx) {
        const file = ctx.request.files.file
        const baseName = path.basename(file.filepath)
        ctx.body = {url: `${ctx.origin}/uploads/${baseName}`}
    }
}

module.exports = new HomeCtl()
