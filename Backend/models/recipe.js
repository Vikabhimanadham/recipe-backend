const mangoose = require('mongoose');

const recipeSchema = new mangoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true
    },
    steps: {
        type: [String],
        //required: true,
    },
    imageUrl: {
        type: String,
    },
    author: {
        type: mangoose.Schema.Types.ObjectId,
        ref: 'User',
       // required: true,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    Comments: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
module.exports = mangoose.model('Recipe', recipeSchema);