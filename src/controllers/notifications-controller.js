import { Subscription } from '../models/subscriptionModel';

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
                res.status(200).json({ message: "Subscription added successfully!" });
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    })
}

const webpush = require('web-push');

const getSubscribers = (activity, USER_SUBSCRIPTIONS) => {
    return USER_SUBSCRIPTIONS
    .filter(subObj => subObj.user.grade === activity.grade && subObj.user.subscription.find(f => f.subId === activity.subject));
}

export function sendNewsletter(req, res) {

    console.log('Total subscriptions', USER_SUBSCRIPTIONS.length);

    // sample notification payload
    const notificationPayload = {
        "notification": {
            "title": "New Update",
            "body": "You have an update!",
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

    Promise.all(USER_SUBSCRIPTIONS
        .map(subObj => webpush.sendNotification(
        subObj.sub, JSON.stringify(notificationPayload))))
        .then(() => res.status(200).json({ message: 'Newsletter sent successfully.' }))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });

}

export function pushNotifications(activity) {
    let actBody = activity.description 
    if (actBody.length > 100) {
        actBody = actBody.substr(0,100);
    }
    actBody = `${actBody}...
Updated by: ${activity.author}`;
    const notificationPayload = {
        "notification": {
            "title": activity.title,
            "body": actBody,
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

    /***
     * Fetch all ubscriptions
     * Based on activity filter the target subscriptions
     * map over the subscriptions and call sendNotification 
     ***/
    Subscription.find({})
    .then(allSubs => getSubscribers(activity, allSubs))
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