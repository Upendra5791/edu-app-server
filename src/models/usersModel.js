import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    summary: String,
    description: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    type: String
})

const userSchema = new Schema({
    username: String,
    password: String,
    mobile: String,
    email: String,
    grade: String,
    teacher: Boolean,
    subscription: [String],
    notifications: [notificationSchema],
    avatar: String

});
export const User = mongoose.model('User', userSchema);
