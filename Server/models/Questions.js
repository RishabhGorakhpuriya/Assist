const mongoose = require('mongoose');
const { Schema } = mongoose
const questionSchema = new Schema({
    question: { type: String, required: true },
    options: [{ type: String }], // Array of options
    answer: { type: String },
    questionType: { type: String },
    topic : {type:String},
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
    // createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    // assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true }
});

questionSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

questionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
