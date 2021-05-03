"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.User = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var notificationSchema = new Schema({
    summary: String,
    description: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    type: String
});

var userSchema = new Schema({
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
var User = exports.User = _mongoose2.default.model('User', userSchema);