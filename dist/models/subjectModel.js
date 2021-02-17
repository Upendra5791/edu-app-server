'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Subject = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var studyMaterialSchema = new Schema({
    type: {
        type: String,
        required: 'Enter Study Material Type'
    },
    src: {
        type: String,
        required: 'Enter Study Material source'
    }
});

var chapterSchema = new Schema({
    name: {
        type: String,
        required: 'Enter Chapter Name'
    },
    studyMaterial: [studyMaterialSchema]
});

var subjectSchema = new Schema({
    name: {
        type: String,
        required: 'Enter Name'
    },
    teacher: {
        type: String,
        required: 'Enter Teacher Name'
    },
    chapters: [chapterSchema],
    subscribers: [String]
});

var Subject = exports.Subject = _mongoose2.default.model('Subject', subjectSchema);