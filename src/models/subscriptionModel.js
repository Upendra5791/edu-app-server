import mongoose from "mongoose";
import { userSchema } from './usersModel';

const Schema = mongoose.Schema;

const subscriptionsSchema = new Schema({
    user: userSchema,
    sub: Schema.Types.Mixed,
    userId: String
})

export const Subscription = mongoose.model('Subscription', subscriptionsSchema);
