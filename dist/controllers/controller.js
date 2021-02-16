'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getActivityByParams = exports.addActivity = exports.register = exports.login = exports.addChapterInSubject = exports.getSubject = exports.addNewSubject = exports.getAllSubjects = exports.getUser = exports.getAllUsers = exports.addUser = undefined;

var _usersModel = require('../models/usersModel');

var _subjectModel = require('../models/subjectModel');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _activityModel = require('../models/activityModel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addUser = exports.addUser = function addUser(req, res) {
    console.log('Add User');
    var newUser = new _usersModel.User(req.body);
    newUser.save(function (user, err) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
};

var getAllUsers = exports.getAllUsers = function getAllUsers(req, res) {
    console.log('Get All Users');
    _usersModel.User.find({}, function (users, err) {
        if (err) {
            res.send(err);
        } else {
            res.json(users);
        }
    });
};

var getUser = exports.getUser = function getUser(req, res) {
    _usersModel.User.findById(req.params.userID, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
};

var getAllSubjects = exports.getAllSubjects = function getAllSubjects(req, res) {
    console.log('Get All Subjects');
    _subjectModel.Subject.find({}, function (subjects, err) {
        if (err) {
            res.send(err);
        } else {
            res.json(subjects);
        }
    });
};

var addNewSubject = exports.addNewSubject = function addNewSubject(req, res) {
    console.log('Add New Subject');
    var newSubject = new _subjectModel.Subject(req.body);
    newSubject.save(function (err, subject) {
        if (err) {
            res.send(err);
        } else {
            res.json(subject);
        }
    });
};

var getSubject = exports.getSubject = function getSubject(req, res) {
    console.log('Get Subjects');
    _subjectModel.Subject.findById(req.params.subjectID, function (err, subject) {
        if (err) {
            res.send(err);
        } else {
            res.json(subject);
        }
    });
};

var addChapterInSubject = exports.addChapterInSubject = function addChapterInSubject(req, res) {
    _subjectModel.Subject.findById(req.body.subjectID, function (err, subject) {
        if (err) {
            res.send(err);
        } else {
            subject.chapters.push(req.body.chapter);
            subject.save(function (err, subject) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(subject);
                }
            });
        }
    });
};

var login = exports.login = function login(req, res) {
    console.log('login', req.body);
    var reqUser = req.body;
    _usersModel.User.findOne({ username: reqUser.username }, function (err, user) {
        if (err) {
            res.sendStatus(401);
        } else {
            if (user && user.username === reqUser.username && user.password === reqUser.password) {
                var token = _jsonwebtoken2.default.sign({ userID: user.id }, 'edu-app-super-shared-secret', { expiresIn: '2h' });
                delete user.password;
                res.send({ 'token': token, 'user': user });
            } else {
                res.sendStatus(401);
            }
        }
    });
};

var register = exports.register = function register(req, res) {
    console.log('register', req.body);
    // add user to DB
    delete req.body._id;
    var newUser = new _usersModel.User(req.body);
    newUser.save(function (err, user) {
        if (err) {
            res.send(err);
        } else {
            var token = _jsonwebtoken2.default.sign({ userID: user.id }, 'edu-app-super-shared-secret', { expiresIn: '2h' });
            delete user.password;
            res.send({ 'token': token, 'user': user });
        }
    });
};

var addActivity = exports.addActivity = function addActivity(req, res) {
    console.log('Add New Activity');
    var newActivity = new _activityModel.Activity(req.body);
    newActivity.save(function (err, activity) {
        if (err) {
            res.send(err);
        } else {
            res.json(activity);
        }
    });
};

var getActivityByParams = exports.getActivityByParams = function getActivityByParams(req, res) {
    console.log('Get Activity');
    if (!req.body.grade || !req.body.subject) {
        res.send('Incorrect Parameters');
        return;
    }
    _activityModel.Activity.find({ "grade": req.body.grade, "subject": req.body.subject }, function (activities, err) {
        if (err) {
            res.send(err);
        } else {
            res.json(activities);
        }
    });
};

/***************File Upload**********************/

/* Firebase Setup */
var uuid = require('uuid-v4');
var firebase = require("firebase-admin");
var serviceAccount = require("../../cert/firebase-service-account-cert.json");
var firebaseConfig = {
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: 'gs://edu-app-42506.appspot.com'
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
//   var storage = require('@google-cloud/storage');
//   var storageRef = storage.ref();
var bucket = firebase.storage().bucket();

/* const multer = require('multer')
const upload = multer({ dest: 'uploads/' }).single('file');
export const fileUpload = async(req, res, next) => {
    var path = '';
/*         const file = await bucket.file('c39163918a7ecea92d3f473c56701405');
        console.log(file); * /
//res.download(file)
     upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        const metadata = {
            metadata: {
              firebaseStorageDownloadTokens: uuid()
            },
            contentType: req.file.mimetype,
            cacheControl: 'public, max-age=31536000',
          };
          bucket.upload(req.file.path, {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            metadata: metadata,
          }).then(fileRes => {
            const fileData = fileRes[1];
            res.json({
                message: 'File is uploaded Successfully!',
                fileLink: fileData.mediaLink,
                fileName: fileData.name,
            });
          }).catch(err => {
            res.send(err)
          })
       
    });
}
 */
/* export const downloadFile = (req, res) => {
    const file = bucket.file('bf94043931d71374eaa2772dcec54799');
    console.log(file);
} */