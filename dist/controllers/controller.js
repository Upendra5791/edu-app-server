'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getStudentList = exports.addSubscription = exports.getUploadsbyActivity = exports.getRecentStudentUploads = exports.addStudentUpload = exports.getActivityByParams = exports.updateActivity = exports.deleteActivity = exports.addActivity = exports.register = exports.login = exports.addChapterInSubject = exports.getSubject = exports.addNewSubject = exports.getAllSubjects = exports.getUser = exports.getAllUsers = exports.updateUser = exports.addUser = undefined;

var _usersModel = require('../models/usersModel');

var _subjectModel = require('../models/subjectModel');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _activityModel = require('../models/activityModel');

var _studentUploadModel = require('../models/studentUploadModel');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Promise = require('promise');

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

var updateUser = exports.updateUser = function updateUser(req, res) {
    console.log('Update User');
    _usersModel.User.findByIdAndUpdate(req.body._id, req.body, { new: true, useFindAndModify: false }).then(function (updatedUser) {
        res.json(updatedUser);
    }).catch(function (err) {
        res.status(500).send(err);
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
    _usersModel.User.findOne({ email: reqUser.email.toLowerCase() }, function (err, user) {
        if (err) {
            res.sendStatus(401);
        } else {
            if (user && user.email === reqUser.email.toLowerCase() && user.password === reqUser.password) {
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
    _usersModel.User.find({ $or: [{ username: newUser.username.toLowerCase() }, { mobile: newUser.mobile }, { email: newUser.email }] }).then(function (userList) {
        return validateUser(newUser, userList);
    }).then(function (validateRes) {
        if (validateRes.error) {
            res.status(401).json({
                status: 'failed',
                message: validateRes.message
            });
        } else {
            newUser.username = newUser.username.toLowerCase();
            newUser.save(function (err, user) {
                if (err) {
                    res.send(err);
                } else {
                    var token = _jsonwebtoken2.default.sign({ userID: user.id }, 'edu-app-super-shared-secret', { expiresIn: '2h' });
                    delete user.password;
                    res.send({ 'token': token, 'user': user });
                }
            });
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

var deleteActivity = exports.deleteActivity = function deleteActivity(req, res) {
    console.log('Delete Activity');
    var act = req.body;
    console.log(act);
    _activityModel.Activity.findByIdAndDelete(act._id, function (err, resp) {
        if (err) {
            res.send(err);
        } else {
            res.json(resp);
        }
    });
};

var updateActivity = exports.updateActivity = function updateActivity(req, res) {
    console.log('update Activity');
    var act = new _activityModel.Activity(req.body);
    _activityModel.Activity.findByIdAndUpdate(act._id, act, function (err, resp) {
        if (err) {
            res.send(err);
        } else {
            res.json(resp);
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

var addStudentUpload = exports.addStudentUpload = function addStudentUpload(req, res) {
    console.log('Add New Student Upload');
    var newUpload = new _studentUploadModel.StudentUpload(req.body.file);
    newUpload.save().then(function (upload) {
        var act = req.body.activity;
        act.studentUpload.push(upload._id);
        _activityModel.Activity.findByIdAndUpdate(act._id, act, { new: true, useFindAndModify: false }).then(function (updatedAct) {
            res.json(updatedAct);
        }).catch(function (err) {
            res.send(err);
        });
    });
};

var getRecentStudentUploads = exports.getRecentStudentUploads = function getRecentStudentUploads(req, res) {
    console.log('Get Student List');
    _studentUploadModel.StudentUpload.find({ 'author': req.body.userId, 'activityId': req.body.activityId }).then(function (list) {
        res.json(list);
    }).catch(function (err) {
        res.status(500).json({ error: err });
    });
};

var getUploadsbyActivity = exports.getUploadsbyActivity = function getUploadsbyActivity(req, res) {
    console.log('Get Student update List by activity');
    _studentUploadModel.StudentUpload.find({ 'activityId': req.params.activityId }).then(function (list) {
        res.json(list);
    }).catch(function (err) {
        res.status(500).json({ error: err });
    });
};

var addSubscription = exports.addSubscription = function addSubscription(req, res) {
    console.log('Add Subscription');
    var reqObj = req.body;
    console.log(reqObj);
    _usersModel.User.findById(reqObj.user._id).then(function (currentUser) {
        if (currentUser.subscription.includes(reqObj.subject._id)) {
            return res.json({
                message: 'Subject already subscribed by User!'
            });
        }
        currentUser.subscription.push(reqObj.subject._id);
        currentUser.save().then(function (updatedUser) {
            _subjectModel.Subject.findById(reqObj.subject._id).then(function (currentSubject) {
                if (currentSubject) {
                    var subsObj = {
                        grade: updatedUser.grade,
                        subscriber: updatedUser._id
                    };
                    currentSubject.subscribers.push(subsObj);
                    currentSubject.save().then(function (updatedSubject) {
                        res.json({ user: updatedUser, subject: updatedSubject });
                    });
                }
            });
        });
    }).catch(function (err) {
        res.status(500).json({ error: err });
    });
    /* const currentUser = await User.findById(reqObj.user._id);
    if (currentUser) {
        if (currentUser.subscription.includes(reqObj.subject._id)) {
            return res.json({
                message: 'Subject already subscribed by User!'
            })
        }
        currentUser.subscription.push(reqObj.subject._id);
        const updatedUser = await currentUser.save();
        const currentSubject = await Subject.findById(reqObj.subject._id);
        if (currentSubject) {
            const subsObj = {
                grade: updatedUser.grade,
                subscriber: updatedUser._id
            }
            currentSubject.subscribers.push(subsObj);
            const updatedSubject = await currentSubject.save();
            res.json({user: updatedUser, subject: updatedSubject});
        }
    } */
};

var getStudentList = exports.getStudentList = function getStudentList(req, res) {
    console.log('Get Student List');
    var reqObj = req.body;
    _usersModel.User.find({ 'grade': reqObj.grade }).then(function (g_userList) {
        return g_userList.filter(function (r) {
            return r.subscription.includes(reqObj.subjectID);
        });
    }).then(function (userList) {
        res.json(userList);
    }).catch(function (err) {
        res.status(500).json({ error: err });
    });
};

function getUserListByParams(subjectID, grade) {
    return new Promise(function (resolve, reject) {
        _usersModel.User.find({ 'grade': grade }, function (err, res) {
            if (err) {
                reject(err);
            } else {
                var userList = [];
                if (res) {
                    userList = res.filter(function (r) {
                        return r.subscription.includes(subjectID);
                    });
                    resolve(userList);
                } else {
                    reject(userList);
                }
            }
        });
    });
}

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

var validateUser = function validateUser(newUser, userList) {
    var obj = {
        error: false,
        message: 'success'
    };
    if (userList.filter(function (r) {
        return r.username === newUser.username;
    }).length > 0) {
        obj.error = true;
        obj.message = 'This username is already registered!';
    } else if (userList.filter(function (r) {
        return r.email === newUser.email;
    }).length > 0) {
        obj.error = true;
        obj.message = 'This email is already registered!';
    } else if (userList.filter(function (r) {
        return r.mobile === newUser.mobile;
    }).length > 0) {
        obj.error = true;
        obj.message = 'This mobile number is already registered!';
    }
    return obj;
};

/********* Notification Handler *********/

var addToNotification = function addToNotification(activity) {
    return new Promise(function (resolve, reject) {
        getUserListByParams(activity.subject, activity.grade).then(function (users) {
            if (users) {
                var userList = users;
                var notification = {
                    summary: 'Sample notification',
                    description: 'This is a sample notification description',
                    type: 'new-activity'
                };
                userList.forEach(function (user) {
                    user.notifications.push(notification);
                    user.save(function (err, subject) {
                        if (err) {
                            console.log('Error adding notification to user');
                            // reject('Error adding notification to user')
                        } else {
                            console.log('Notification added');
                        }
                    });
                });
                resolve('Notification added');
            }
        }).catch(function (err) {
            console.log('Error retreiving user list');
            reject('Error retreiving user list');
        });
    });
};