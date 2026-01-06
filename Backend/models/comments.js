const mangoose = require('amngoose');

const commentSchema = new mangoose.Schema({
    recipe: {
        type: mangoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    user: {
        type: mangoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
},{timestamps: true});

module.exports= mangoose.model('Comment',commentSchema);