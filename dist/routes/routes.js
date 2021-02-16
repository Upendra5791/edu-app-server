'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _controller = require('../controllers/controller');

/* const multer = require('multer')
const upload = multer({ dest: 'uploads/' }).single('file'); */

var routes = function routes(app) {
    app.route('/subjects').get(_controller.getAllSubjects).post(_controller.addNewSubject);

    app.route('/addChapter').post(_controller.addChapterInSubject);

    app.route('/subject/:subjectID').get(_controller.getSubject);

    app.route('getUser').get(_controller.getAllUsers);

    app.route('/login').post(_controller.login);

    app.route('/register').post(_controller.register);

    app.route('/user').get(_controller.getAllUsers).post(_controller.addUser);

    app.route('/user/:userID').get(_controller.getUser);

    /*     app.route('/upload')
            .post(fileUpload) */

    app.route('/activity').post(_controller.addActivity);

    app.route('/getActivityByParams').post(_controller.getActivityByParams);

    app.route('/test').get(function (req, res) {
        res.send('API test successful!');
    });
};

exports.default = routes;