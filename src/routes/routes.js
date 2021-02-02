import { getAllUsers, addUser, login, register,
         getAllSubjects, getSubject, addNewSubject,
         addChapterInSubject, getUser } from '../controllers/controller';

const routes = (app) => {
    app.route('/subjects')
        .get(getAllSubjects)
        .post(addNewSubject)

    app.route('/addChapter')
        .post(addChapterInSubject)

    app.route('/subject/:subjectID')
        .get(getSubject)

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

    app.route('/test')
        .get((req, res) => {
            res.send('API test successful!')
        })


}

export default routes;