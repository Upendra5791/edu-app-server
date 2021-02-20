"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Activity = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var fileSchema = new Schema({
    name: String,
    author: String,
    description: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    subject: String,
    grade: String,
    link: String,
    type: String
});

var activitySchema = new Schema({
    title: String,
    author: String,
    description: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    subject: String,
    grade: String,
    enableStudentUpload: Boolean,
    teacherUpload: [fileSchema],
    studentUpload: [fileSchema]
});
var Activity = exports.Activity = _mongoose2.default.model('Activity', activitySchema);