import {
    getAllUsers, addUser, login, register,
    getAllSubjects, getSubject, addNewSubject,
    addChapterInSubject, getUser, addActivity, getActivityByParams,
    deleteActivity, updateActivity, addStudentUpload, getRecentStudentUploads,
    getUploadsbyActivity, updateUser,
    addSubscription, getStudentList
} from '../controllers/controller';

import { sendNewsletter, addPushSubscriber }
from '../controllers/notifications-controller'


/* const multer = require('multer')
const upload = multer({ dest: 'uploads/' }).single('file'); */

const routes = (app) => {
    /***** SUBJECT ROUTES *****/
    app.route('/subjects')
        .get(getAllSubjects)
        .post(addNewSubject)

    app.route('/addChapter')
        .post(addChapterInSubject)

    app.route('/subject/:subjectID')
        .get(getSubject)
    
    app.route('/addSubscription')
    .post(addSubscription)

    /***** USER ROUTES *****/
    app.route('/login')
        .post(login)

    app.route('/register')
        .post(register)

    app.route('/user')
        .get(getAllUsers)
        .post(addUser);

    app.route('/user/:userID')
        .get(getUser)

    app.route('/updateUser')
        .post(updateUser)

    app.route('/getStudentList')
        .post(getStudentList)

    /***** ACTIVITY ROUTES *****/
    app.route('/activity')
        .post(addActivity)

    app.route('/getActivityByParams')
    .post(getActivityByParams)

    app.route('/deleteActivity')
    .post(deleteActivity)

    app.route('/updateActivity')
    .post(updateActivity)

    app.route('/addStudentUpload')
    .post(addStudentUpload)

    app.route('/getRecentStudentUploads')
    .post(getRecentStudentUploads)

    app.route('/getuploadsByActivity/:activityId')
    .get(getUploadsbyActivity)

    app.route('/test')
        .get((req, res) => {
            res.send('API test successful!')
        })

    /***** NOTIFICATION ROUTES *****/
    app.route('/notifications')
    .post(addPushSubscriber)
    app.route('/newsletter')
    .post(sendNewsletter)

}

export default routes;