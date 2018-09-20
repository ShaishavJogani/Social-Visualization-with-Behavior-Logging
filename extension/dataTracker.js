var time_at_loading = "";
document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var result = {};
    var parameters = {};
    var now = (new Date()).toJSON();
    result.timestamp = now;
    result.url = window.location.href;

    if (target.className === "question-hyperlink") {
        result.log_event = "QuestionClick";
        result.tags = getQuestionTagsOutSide(target);
        parameters.text = target.innerText;
        parameters.votes = getQuestionVotesOutSide(target);
        parameters.answers = getQuestionAnswersOutSide(target);
        parameters.views = getQuestionViewssOutSide(target);
    } else if (target.className === "page-numbers") {
        result.log_event = "PageChange";
        result.tags = getQuestionTagsOutSide(target);
    } else {

        if (target.className.match(/^vote-up-off.*$/)) {
            result.log_event = "UpVote";
        } else if (target.className.match(/^vote-down-off.*$/)) {
            result.log_event = "DownVote";
        } else if (target.className === "star-off star-on") {
            result.log_event = "Favorite";
        } else if (target.className === "star-off") {
            result.log_event = "UnFavorite";
        } else if (target.className.match(/^post-tag.*$/)) {
            result.log_event = "TagClick";
            parameters.text = target.innerText;
        } else if (target.className === "short-link") {
            result.log_event = "share";
        }
        if (result.log_event) {
            result.tags = getQuestionTagsInside();
            setQuestionDetailsInside(parameters);
        }
    }

    result.parameters = JSON.stringify(parameters);

    if (result.log_event) {
        chrome.runtime.sendMessage(result, function(response) {
            console.log(result);
        });
    }
});


function getQuestionTagsOutSide(target) {
    var tags = [];
    var addtags = target.parentElement.parentElement.getElementsByClassName('post-tag');
    for (var i = 0; i < addtags.length; i++) {
        var image_tags = (addtags[i].innerText).split(">");
        tags.push(image_tags[image_tags.length - 1]);
    }
    return JSON.stringify(tags);
}

function getQuestionVotesOutSide(target) {
    var element = target.parentElement.parentElement.parentElement;
    var votes = (element.getElementsByClassName('vote-count-post')[0].childNodes)[0].innerText;
    return parseToInt(votes);
}

function getQuestionViewssOutSide(target) {
    var element = target.parentElement.parentElement.parentElement;
    var views = (element.getElementsByClassName('views')[0].getAttribute('title')).split(" ")[0];
    return parseToInt(views);
}

function getQuestionAnswersOutSide(target) {
    var element = target.parentElement.parentElement.parentElement;
    var answers = (element.getElementsByClassName('status')[0].childNodes)[1].innerText;
    return parseToInt(answers);
}

function setQuestionDetailsInside(parameters) {
    if (!parameters.hasOwnProperty('text')) {
        parameters.text = getQuestionInside();
    }
    parameters.votes = getQuestionVotesInside();
    parameters.views = getQuestionViewsInside();
    parameters.favorite = getQuestionBookemarkInside();
}

function getQuestionInside() {
    var div = document.getElementById('question-header');
    var question = div.getElementsByClassName('question-hyperlink')[0].innerText;
    return question;
}

function getQuestionTagsInside() {
    tagsArray = new Array();
    var tag_div = document.getElementsByClassName('post-taglist')[0];
    if (tag_div) {
        tag = tag_div.getElementsByClassName('post-tag js-gps-track'), i = tag.length;
        while (i--) {
            var x = tag[i].innerText;
            var image_tags = x.split(">");
            tagsArray.push(image_tags[image_tags.length - 1]);
        }
    }
    return JSON.stringify(tagsArray);
}

function getQuestionVotesInside() {
    var div = document.getElementById('question');
    var votes = div.getElementsByClassName('vote-count-post')[0].innerText;
    return parseToInt(votes);
}

function getQuestionViewsInside() {
    var div = document.getElementById('qinfo');
    var views = (div.getElementsByClassName('label-key')[3].childNodes)[1].innerText.split(" ")[0];
    return parseToInt(views);
}

function getQuestionBookemarkInside() {
    var favourites = (document.getElementsByClassName('favoritecount')[0].childNodes)[0].innerText;
    return parseToInt(favourites);
}

function parseToInt(number) {
    return parseInt(number.replace(/,/g, ''));
}


// var count = 0;
// Tracker.find({username: uname,activity:"..."}).then(result => {
//   count = result.length;
//   }
//
// ---------******-------------
// app.get('/notifications', async (req, res) => {
//   var count = 0;
//   var query = Tracker.find({username: uname,activity:"..."});
//   result = await query.exec();
//   count = result.length;
// }
