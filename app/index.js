const Koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const {connect} = require('mongoose')
const path = require('path')
const routing = require('./routes')
const config = require('./config')
const app = new Koa()

connect(config.connectionStr, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(res => {
    console.log("连接成功");
}).catch(e => {
    console.log(e);
})

app.use(koaStatic(path.join(__dirname, 'public')))

// 错误处理
app.use(error({
    postFormat: (e, { stack, ...rest }) =>
        process.env.NODE_ENV === 'production'
            ? rest : { stack, ...rest }

}))

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true  // 保留拓展名
    },
    onFileBegin (name, file) {
        console.log(name, file)
    }
}))

// 校验参数
app.use(parameter(app))
routing(app)

app.listen(3000, () => {
    console.log('listener is port 3000')
})
