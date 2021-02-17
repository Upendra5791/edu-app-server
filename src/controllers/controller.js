import { User } from '../models/usersModel';
import { Subject } from '../models/subjectModel';
import jwt from 'jsonwebtoken';
import { Activity } from '../models/activityModel';

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
    User.findOne({ username: reqUser.username }, (err, user) => {
        if (err) {
            res.sendStatus(401);
        } else {
            if (user && user.username === reqUser.username && user.password === reqUser.password) {
                var token = jwt.sign({ userID: user.id }, 'edu-app-super-shared-secret', { expiresIn: '2h' });
                delete user.password;
                res.send({ 'token': token, 'user': user });
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
            res.send({ 'token': token, 'user': user });
        }
    });
}

export const addActivity = (req, res) => {
    console.log('Add New Activity');
    const newActivity = new Activity(req.body)
    newActivity.save((err, activity) => {
        if (err) {
            res.send(err);
        } else {
            res.json(activity);
        }
    })
}

export const getActivityByParams = (req, res) => {
    console.log('Get Activity');
    if (!req.body.grade || !req.body.subject) {
        res.send('Incorrect Parameters');
        return;
    }
    Activity.find({ "grade": req.body.grade, "subject": req.body.subject }, (activities, err) => {
        if (err) {
            res.send(err)
        } else {
            res.json(activities)
        }
    })
}

export const addSubscription = async (req, res) => {
    console.log('Add Subscription');
    const reqObj = req.body;
    console.log(reqObj);
    User.findById(reqObj.user._id)
        .then(currentUser => {
            if (currentUser.subscription.includes(reqObj.subject._id)) {
                return res.json({
                    message: 'Subject already subscribed by User!'
                })
            }
            currentUser.subscription.push(reqObj.subject._id);
            currentUser.save()
                .then(updatedUser => {
                    Subject.findById(reqObj.subject._id)
                        .then(currentSubject => {
                            if (currentSubject) {
                                const subsObj = {
                                    grade: updatedUser.grade,
                                    subscriber: updatedUser._id
                                }
                                currentSubject.subscribers.push(subsObj);
                                currentSubject.save()
                                    .then(updatedSubject => {
                                        res.json({ user: updatedUser, subject: updatedSubject });
                                    })
                            }
                        })
                })
        }).catch(err => {
            res.status(500).json({ error : err });
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
}

/***************File Upload**********************/

/* Firebase Setup */
const uuid = require('uuid-v4');
const firebase = require("firebase-admin");
const serviceAccount = require("../../cert/firebase-service-account-cert.json");
const firebaseConfig = {
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: 'gs://edu-app-42506.appspot.com'
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
//   var storage = require('@google-cloud/storage');
//   var storageRef = storage.ref();
const bucket = firebase.storage().bucket();

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