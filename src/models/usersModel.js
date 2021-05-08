import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    summary: String,
    description: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    type: String,
    data:  Schema.Types.Mixed,
})

export const userSchema = new Schema({
    username: String,
    password: String,
    mobile: String,
    email: String,
    grade: String,
    teacher: Boolean,
    subscription: [
        {
            subId: String,
            approved: {
                type: Boolean,
                default: false
            }
        }
    ],
    notifications: [notificationSchema],
    avatar: String,
    subjects: [String]

});
export const User = mongoose.model('User', userSchema);
