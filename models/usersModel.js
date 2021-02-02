import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    mobile: String,
    email: String,
    grade: String,
    teacher: Boolean
});
export const User = mongoose.model('User', userSchema);
