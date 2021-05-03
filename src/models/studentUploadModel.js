import mongoose from "mongoose";

const Schema = mongoose.Schema;

const studentUploadSchema = new Schema({
    name: String,
    author: String,
    authorName: String,
    description: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    subject: String,
    grade: String,
    link: String,
    type: String,
    activityId: String
});
export const StudentUpload = mongoose.model('StudentUpload', studentUploadSchema);
