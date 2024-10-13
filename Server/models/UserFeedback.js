const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema
const UserFeedback = new Schema({
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required : true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required : true },
    feedback: { type: String},
    rating : {type: Number},
    createdAt: { type: Date, default: Date.now }
});

// Virtual field for ID
UserFeedback.virtual('id').get(function() {
    return this._id.toHexString();
});

// Set schema toJSON options
UserFeedback.set('toJSON', {
    virtuals: true,  // Include virtuals in JSON output
    versionKey: false,  // Exclude version key
    transform: function(doc, ret) {
        delete ret._id;  // Remove _id field from the output
    }
});

// Define the model with a consistent name
const UsersFeedback = mongoose.model('UserFeedback', UserFeedback);

module.exports = UsersFeedback;