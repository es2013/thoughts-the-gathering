const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
//will need to create a date format js file 
//const dateFormat = //require('../utils/dateFormat');

const thoughtSchema = new Schema (
    {
        thoughtText:{
            type:String,
            required: true,
            minLength:1,
            maxLength:280
        },
        createdAt:{
            type:Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        username:{
            type: String,
            required:true
        },
        reaction: [reachtionSchema]
    },
    {
        toJSON:{
            virtuals:true,
            getters:true
        },
        id:false
    }
 );
//virtual called reactionCount that retrieves the length of array
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;