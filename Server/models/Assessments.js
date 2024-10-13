const mongoose = require('mongoose');
const { Schema } = mongoose
const assessmentSchema = Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: { type: Date, default: Date.now }, // Automatically set to the current date
    isActive: { type: Boolean, default: true } // Default to true, indicating that the assessment is active
});
assessmentSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

assessmentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
