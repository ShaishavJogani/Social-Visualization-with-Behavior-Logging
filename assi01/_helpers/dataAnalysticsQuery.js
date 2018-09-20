var tracker = require('_helpers/Tracker.js');
var Tracker = tracker.Tracker;


function getTagFrequencyByUser(req, res, next) {

    if (req.body.activity) {
        activity = req.body.activity;
    } else {
        res.json({message: 'unidentify event'});
    }

    if (req.body.userData == 'false') {
        uname = '$'
    } else {
        uname = req.session.user.username
    }
    Tracker.aggregate([{
            $match: {
                username: {
                    $regex: uname
                },
                log_event: activity
            }
        }, {
            $unwind: {
                path: "$tags"
            }
        }, {
            $group: {
                _id: {
                    shaishav: "$tags"
                },
                tag: {
                    $first: "$tags"
                },
                count: {
                    $sum: 1
                }
            }
        }, {
            $sort: {
                count: -1
            }
        }, {
            $limit: 10
        }]

    ).then(response => {
        res.json(response);
    }).catch(err => {
        console.log('err+');
        console.log(err);
        res.send(err);
    });
}


module.exports = {
    getTagFrequencyByUser: getTagFrequencyByUser
}
