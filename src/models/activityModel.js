import mongoose from "mongoose";

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: String,
    author: String,
    description: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    subject: String,
    grade: String,
    fileLink: String
});

const activitySchema = new Schema({
    title: String,
    author: String,
    description: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    subject: String,
    grade: String,
    teacherUpload: [fileSchema],
    studentUpload: [fileSchema]
});
export const Activity = mongoose.model('Activity', activitySchema);