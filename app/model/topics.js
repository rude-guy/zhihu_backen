const mongoose = require('mongoose')

const { Schema, model } = mongoose

// 创建json结构
const topicSchema = new Schema({
    __v: {type: Number, select: false},
    name: {type: String, required: true},
    avatar_url: {type: String},
    introduction: {type: String, select: false},
})

// 集合
module.exports = model('Topic', topicSchema)
