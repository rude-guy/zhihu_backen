const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const {connect} = require('mongoose')
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

// 错误处理
app.use(error({
    postFormat: (e, { stack, ...rest }) =>
        process.env.NODE_ENV === 'production'
            ? rest : { stack, ...rest }
}))

app.use(bodyparser())
// 校验参数
app.use(parameter(app))
routing(app)

app.listen(3000, () => {
    console.log('listener is port 3000')
})
