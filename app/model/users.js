const mongoose = require('mongoose')

const { Schema, model } = mongoose

// 创建json结构
const userSchema = new Schema({
    __v: {type: Number, select: false},
    name: {type: String, required: true},
    password: {type: String, required: true, select: false},
    avatar_url: {type: String},
    gender: {type: String, enum: ['male', 'female'], default: 'male', required: true},
    headline: {type: String},
    locations: {type: [{type: Schema.Types.ObjectId, ref: 'Topic'}], select: false},
    business: {type: Schema.Types.ObjectId, ref: 'Topic', select: false},
    employments: {
        type: [{
           company: {type: Schema.Types.ObjectId, ref: 'Topic'},
           job: {type: Schema.Types.ObjectId, ref: 'Topic'}
        }],
        select: false
    },
    educations: {
        type: [{
            school: {type: Schema.Types.ObjectId, ref: 'Topic'},
            major: {type: Schema.Types.ObjectId, ref: 'Topic'},
            diploma: {type: Number, enum: [1, 2, 3, 4, 5]},
            entrance_year: {type: String},
            graduation: {type: String}
        }],
        select: false
    },
    following: {
      type: [{type: Schema.Types.ObjectId, ref: 'User'}],
      select: false
    },
    followingTopics: {
        type: [{type: Schema.Types.ObjectId, ref: 'User'}],
        select: false
    }
})

// 集合
module.exports = model('User', userSchema)
