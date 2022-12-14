'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _controller = require('../controllers/controller');

/* const multer = require('multer')
const upload = multer({ dest: 'uploads/' }).single('file'); */

var routes = function routes(app) {
    /***** SUBJECT ROUTES *****/
    app.route('/subjects').get(_controller.getAllSubjects).post(_controller.addNewSubject);

    app.route('/addChapter').post(_controller.addChapterInSubject);

    app.route('/subject/:subjectID').get(_controller.getSubject);

    app.route('/addSubscription').post(_controller.addSubscription);

    /***** USER ROUTES *****/
    app.route('/login').post(_controller.login);

    app.route('/register').post(_controller.register);

    app.route('/user').get(_controller.getAllUsers).post(_controller.addUser);

    app.route('/user/:userID').get(_controller.getUser);

    app.route('/updateUser').post(_controller.updateUser);

    app.route('/getStudentList').post(_controller.getStudentList);

    /***** ACTIVITY ROUTES *****/
    app.route('/activity').post(_controller.addActivity);

    app.route('/getActivityByParams').post(_controller.getActivityByParams);

    app.route('/deleteActivity').post(_controller.deleteActivity);

    app.route('/updateActivity').post(_controller.updateActivity);

    app.route('/addStudentUpload').post(_controller.addStudentUpload);

    app.route('/getRecentStudentUploads').post(_controller.getRecentStudentUploads);

    app.route('/getuploadsByActivity/:activityId').get(_controller.getUploadsbyActivity);

    app.route('/test').get(function (req, res) {
        res.send('API test successful!');
    });
};

exports.default = routes;