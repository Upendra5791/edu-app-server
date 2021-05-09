import { Subscription } from '../models/subscriptionModel';
import { User } from '../models/usersModel';

export function addPushSubscriber(req, res) {
    console.log('add notification subscriber!');
    const subObj = req.body;

    /*** 
     * Check the Subscription collection for the userId of the subscriber
     * If subscription with the userId exists, return success with message.
     * If subscription does not exist then add the subsciption to the Subscription collection.
     ***/
    Subscription.find({userId: subObj.user._id})
    .then(user => {
        if (user && user.length > 0) {
            res.status(200).json({ message: "Subscription already exists!" });
        } else {
            const newSub = new Subscription({userId: subObj.user._id, ...subObj});
            newSub.save()
            .then(nsub => {
                console.log('Added Subscription on the server: ', nsub);
                User.findById(subObj.user._id)
                    .then(subUser => {
                        subUser.appSubscription = true;
                        subUser.save()
                            .then(updatedUser => {
                                res.status(200).json(updatedUser);
                            })
                    })            
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    })
}

const webpush = require('web-push');

const getSubscribers = (data, USER_SUBSCRIPTIONS) => {
    return USER_SUBSCRIPTIONS
    .filter(subObj =>
        data.type === 'addSubscription' ?
        subObj.userId === data.teacherId :
        subObj.user.grade === data.grade && subObj.user.subscription.find(f => f.subId === data.subjectId));
}


function getNotificationText(data, type) {
    let title = '';
    let body = '';
    switch (type) {
        case 'addActivity':
            title = data.activity.title;
            body = data.activity.description 
            if (body.length > 100) {
                body = body.substr(0,100) + '...';
            }
            body = `${body}
Updated by: ${data.activity.author}`;
            break;        
        case 'approveSubscription':
            title = 'Subscription Approved!';
            body = `Your subscription request for ${data.sub.name} has been approved by ${data.teacher.username}.`;
            break;
        case 'addSubscription':
            title = 'Subscription Request!';
            body = `${data.user.username} has requested subscription for ${data.sub.name}, ${data.user.grade}`;
            break;
        default:
            break;
    }

    const notificationPayload = {
        "notification": {
            "title": title,
            "body": body,
            "icon": "assets/android-icon-192x192.png",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    };

    return notificationPayload;
}

function getSubObj(data, type) {
    let grade, subjectId, teacherId;
    switch (type) {
        case 'addActivity':
            grade = data.activity.grade;
            subjectId = data.activity.subject;
            teacherId = null;
            break;
        case 'addSubscription':
            grade = data.user.grade;
            subjectId = data.sub._id;
            teacherId = data.teacher.id;
        break;
        case 'approveSubscription':
            grade = data.user.grade;
            subjectId = data.sub.id;
            teacherId = data.teacher.id;
        break;    
        default:
            break;
    }
    return { grade, subjectId, type, teacherId }
}

export function pushNotifications(data, type) {
    /* data = {
        user: User,
        sub: Subject,
        teacher: User
        activity: Activity
    } */

    const notificationPayload = getNotificationText(data, type);
    const subObj = getSubObj(data, type);
    /***
     * Fetch all subscriptions
     * Based on data filter the target subscriptions
     * map over the subscriptions and call sendNotification 
     ***/
    Subscription.find({})
    .then(allSubs => getSubscribers(subObj, allSubs))
    .then(pushSubscribers => {
        Promise.all(pushSubscribers
            .map(subObj => {
                return webpush.sendNotification(subObj.sub, JSON.stringify(notificationPayload))
            }
            ))
            .then(() => console.log({ message: 'Newsletter sent successfully.' }))
            .catch(err => {
                console.error("Error sending notification, reason: ", err);
            });
    })
}