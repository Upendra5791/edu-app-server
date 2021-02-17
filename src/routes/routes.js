import {
    getAllUsers, addUser, login, register,
    getAllSubjects, getSubject, addNewSubject,
    addChapterInSubject, getUser, addActivity, getActivityByParams,
    addSubscription
} from '../controllers/controller';


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
    app.route('getUser')
        .get(getAllUsers)

    app.route('/login')
        .post(login)

    app.route('/register')
        .post(register)

    app.route('/user')
        .get(getAllUsers)
        .post(addUser);

    app.route('/user/:userID')
        .get(getUser)

/*     app.route('/upload')
        .post(fileUpload) */

    /***** ACTIVITY ROUTES *****/
    app.route('/activity')
        .post(addActivity)

    app.route('/getActivityByParams')
    .post(getActivityByParams)

    app.route('/test')
        .get((req, res) => {
            res.send('API test successful!')
        })


}

export default routes;