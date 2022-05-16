const mongoose = require('mongoose')

const { Schema, model } = mongoose

// 创建json结构
const userSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true, select: false},
    __v: {type: Number, select: false}
})

// 集合
module.exports = model('User', userSchema)