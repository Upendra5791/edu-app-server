"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StudentUpload = undefined;

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var studentUploadSchema = new Schema({
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
var StudentUpload = exports.StudentUpload = _mongoose2.default.model('StudentUpload', studentUploadSchema);