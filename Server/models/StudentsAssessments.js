const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema
const studentAssessmentSchema = new Schema({
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required : true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required : true },
    feedback: { type: String},
    score: { type: Number},
    total:{type : Number},
    createdAt: { type: Date, default: Date.now },
    attempted : {type : Boolean, default : false}
});

// Virtual field for ID
studentAssessmentSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// Set schema toJSON options
studentAssessmentSchema.set('toJSON', {
    virtuals: true,  // Include virtuals in JSON output
    versionKey: false,  // Exclude version key
    transform: function(doc, ret) {
        delete ret._id;  // Remove _id field from the output
    }
});

// Define the model with a consistent name
const StudentAssessment = mongoose.model('StudentAssessment', studentAssessmentSchema);

module.exports = StudentAssessment;
