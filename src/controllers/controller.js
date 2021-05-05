import { User } from '../models/usersModel';
import { Subject } from '../models/subjectModel';
import jwt from 'jsonwebtoken';
import { Activity } from '../models/activityModel';
import { StudentUpload } from '../models/studentUploadModel';
import { pushNotifications } from '../controllers/notifications-controller'
var Promise = require('promise');

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

export const updateUser = (req, res) => {
    console.log('Update User');
    User.findByIdAndUpdate(req.body._id, req.body, { new: true, useFindAndModify: false})
    .then(updatedUser => {
        res.json(updatedUser);
    })
    .catch(err => {
        res.status(500).send(err);
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
    User.findOne({ email: reqUser.email.toLowerCase() }, (err, user) => {
        if (err) {
            res.sendStatus(401);
        } else {
            if (user && user.email === reqUser.email.toLowerCase() && user.password === reqUser.password) {
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
    User.find( { $or: [ { username: newUser.username.toLowerCase() }, { mobile: newUser.mobile }, { email: newUser.email} ] })
        .then(userList => {
            return validateUser(newUser, userList);
        }).then(validateRes => {
            if (validateRes.error) {
                res.status(401).json({
                    status: 'failed',
                    message: validateRes.message
                })
            } else {
                newUser.username = newUser.username.toLowerCase(); 
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
        })
}

export const addActivity = (req, res) => {
    console.log('Add New Activity');
    const newActivity = new Activity(req.body)
    newActivity.save((err, activity) => {
        if (err) {
            res.send(err);
        } else {
            res.json(activity);
            pushNotifications(activity)
        }
    })
}

export const deleteActivity = (req, res) => {
    console.log('Delete Activity');
    const act = req.body;
    console.log(act);
    Activity.findByIdAndDelete(act._id, (err, resp) => {
        if (err) {
            res.send(err);
        } else {
            res.json(resp);
        } 
    })
}

export const updateActivity = (req, res) => {
    console.log('update Activity');
    const act = new Activity(req.body);
    Activity.findByIdAndUpdate(act._id, act, (err, resp) => {
        if (err) {
            res.send(err);
        } else {
            res.json(resp);
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

export const addStudentUpload = (req, res) => {
    console.log('Add New Student Upload');
    const newUpload = new StudentUpload(req.body.file);
    newUpload.save()
        .then(upload => {
            const act = req.body.activity;
            act.studentUpload.push(upload._id);
            Activity.findByIdAndUpdate(act._id, act, { new: true, useFindAndModify: false})
                .then(updatedAct => {
                    res.json(updatedAct);
                })
            .catch(err => {
                res.send(err);
            })
        })
} 

export const getRecentStudentUploads = (req, res) => {
    console.log('Get Student List');
    StudentUpload.find({'author': req.body.userId, 'activityId': req.body.activityId})
        .then(list => {
            res.json(list);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
}

export const getUploadsbyActivity = (req, res) => {
    console.log('Get Student update List by activity');
    StudentUpload.find({'activityId': req.params.activityId})
        .then(list => {
            res.json(list);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
}

export const addSubscription = (req, res) => {
    console.log('Add Subscription');
    const reqObj = req.body;
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
}

export const getStudentList = (req, res) => {
    console.log('Get Student List');
    const reqObj = req.body;
    User.find({ 'grade': reqObj.grade })
        .then(g_userList => {
            return g_userList.filter(r => r.subscription.includes(reqObj.subjectID))
        })
        .then(userList => {
            res.json(userList)
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
}

function getUserListByParams(subjectID, grade) {
    return new Promise(function(resolve, reject) {
        User.find({ 'grade': grade }, function(err, res) {
            if (err) {
                reject(err)
            } else {
                let userList = [];
                if (res) {
                    userList = res.filter(r => r.subscription.includes(subjectID))
                    resolve(userList)
                } else {
                    reject(userList);
                }
               
            }
        })
    })
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


const validateUser = (newUser, userList) => {
    const obj = {
        error: false,
        message: 'success'
    }
    if (userList.filter(r => r.username === newUser.username).length > 0) {
        obj.error = true;
        obj.message = 'This username is already registered!';
    } else if (userList.filter(r => r.email === newUser.email).length > 0) {
        obj.error = true;
        obj.message = 'This email is already registered!';
    } else if (userList.filter(r => r.mobile === newUser.mobile).length > 0) {
        obj.error = true;
        obj.message = 'This mobile number is already registered!';
    }
    return obj;
}


/********* Notification Handler *********/

const addToNotification = (activity) => {
    return new Promise((resolve, reject) => {
        getUserListByParams(activity.subject, activity.grade)
        .then(users => {
            if (users) {
                const userList = users;
                const notification = {
                    summary: 'Sample notification',
                    description: 'This is a sample notification description',
                    type: 'new-activity'
                }
                userList.forEach(user => {
                    user.notifications.push(notification);
                    user.save((err, subject) => {
                        if (err) {
                            console.log('Error adding notification to user');
                            // reject('Error adding notification to user')
                        } else {
                            console.log('Notification added');
                        }
                    })

                });
                resolve('Notification added')
            }
        })
        .catch(err => {
            console.log('Error retreiving user list');
            reject('Error retreiving user list')
        })
     })
}