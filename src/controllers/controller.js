import { User } from '../models/usersModel';
import { Subject } from '../models/subjectModel';
import jwt from 'jsonwebtoken';

export const addUser = (req, res) => {
    console.log('Add User')
    const newUser = new User(req.body);
    newUser.save((user, err) => {
        if (err) {
            res.send(err)
        } else {
            res.json(user)
        }
    })
}

export const getAllUsers = (req, res) => {
    console.log('Get All Users')
    User.find({}, (users, err) => {
        if (err) {
            res.send(err)
        } else {
            res.json(users)
        }
    })
}

export const getUser = (req, res) => {
    User.findById(req.params.userID, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    })
}

export const getAllSubjects = (req, res) => {
    console.log('Get All Subjects');
    Subject.find({}, (subjects, err) => {
        if (err) {
            res.send(err)
        } else {
            res.json(subjects)
        }
    })
}

export const addNewSubject = (req, res) => {
    console.log('Add New Subject');
    const newSubject = new Subject(req.body)
    newSubject.save((err, subject) => {
        if (err) {
            res.send(err);
        } else {
            res.json(subject);
        }
    })
}

export const getSubject = (req, res) => {
    console.log('Get Subjects');
    Subject.findById(req.params.subjectID, (err, subject) => {
        if (err) {
            res.send(err);
        } else {
            res.json(subject);
        }
    })
}

export const addChapterInSubject = (req, res) => {
    Subject.findById(req.body.subjectID, (err, subject) => {
        if (err) {
            res.send(err);
        } else {
            subject.chapters.push(req.body.chapter);
            subject.save((err, subject) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(subject);
                }
            })
        }
    })
}

export const login = (req, res) => {
    console.log('login', req.body);
    const reqUser = req.body;
    User.findOne({username: reqUser.username}, (err, user) => {
        if (err) {
            res.sendStatus(401);
        } else {
            if (user && user.username === reqUser.username && user.password === reqUser.password) {
                var token = jwt.sign({ userID: user.id }, 'edu-app-super-shared-secret', { expiresIn: '2h' });
                delete user.password;
                res.send({'token': token, 'user': user});
            } else {
                res.sendStatus(401);
            }
        }
    })
}

export const register = (req, res) => {
    console.log('register', req.body)
    // add user to DB
    delete req.body._id;
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) {
            res.send(err)
        } else {
            var token = jwt.sign({ userID: user.id }, 'edu-app-super-shared-secret', { expiresIn: '2h' });
            delete user.password;
            res.send({'token': token, 'user': user});
        }
    });
}