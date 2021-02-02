'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.register = exports.login = exports.addChapterInSubject = exports.getSubject = exports.addNewSubject = exports.getAllSubjects = exports.getUser = exports.getAllUsers = exports.addUser = undefined;

var _usersModel = require('../models/usersModel');

var _subjectModel = require('../models/subjectModel');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

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