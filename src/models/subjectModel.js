import mongoose from "mongoose";
const Schema = mongoose.Schema;

const studyMaterialSchema = new Schema({
    type: {
        type: String,
        required: 'Enter Study Material Type'
    },
    src: {
        type: String,
        required: 'Enter Study Material source'
    }
})

const chapterSchema = new Schema({
    name: {
        type: String,
        required: 'Enter Chapter Name'
    },
    studyMaterial: [studyMaterialSchema]
})

const subjectSchema = new Schema({
    name: {
        type: String,
        required: 'Enter Name'
    },
    teacher: {
        type: String,
        required: 'Enter Teacher Name'
    },
    chapters: [chapterSchema]
})

export const Subject = mongoose.model('Subject', subjectSchema);