const { Schema, model, Types } = require('mongoose');

const planetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    solarSystem: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [ 'Inner', 'Outer', 'Dwarf' ]
    },
    moons: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    rings: {
        type: String,
        enum: [ 'Yes', 'No' ]
    },
    description : {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likedList : {
        type: [ Types.ObjectId],
        ref: 'User',
        default: []
    },
    author: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Planet = model('Planet', planetSchema);

module.exports = { Planet };