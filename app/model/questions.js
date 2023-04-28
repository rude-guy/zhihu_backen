const mongoose = require('mongoose')

const {Schema, model} = mongoose

const questionSchema = new Schema({
    _v: {type: Number, select: false},
    title: {type: String, required: true},
    description: {type: String},
    questioner: {type: Schema.Types.ObjectId, ref: "user", required: true}
})

model.exports = model('Question', questionSchema)