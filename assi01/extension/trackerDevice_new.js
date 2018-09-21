var time_at_loading = "";
var tags_of_question = [];
document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var tag_div = document.getElementsByClassName('post-taglist')[0];

    if(tag_div){
        tag = tag_div.getElementsByClassName('post-tag js-gps-track'),i = tag.length;
        while (i--) {
            var x = tag[i].innerHTML;
            if(tags_of_question.indexOf(x)<0){
              var half = x.split(">");
              tags_of_question.push(half[half.length - 1]);
            }
        }
    }
    var result = new Object();
    var now = (new Date()).toJSON();
    result.timestamp = now;
    result.url = window.location.href;
    if (target.className.match(/^vote-up-off.*$/)){
        result.activity = "UpVote!";
        result.tags = tags_of_question;
    }
    else if (target.className.match(/^vote-down-off.*$/)){
        result.activity = "DownVote!";
        result.tags = tags_of_question;
    }
    else if (target.className === "star-off star-on"){
        result.activity = "BookMark!";
        result.tags = tags_of_question;
    }
    else if (target.className === "star-off"){
        result.activity = "UnBookMark!";
        result.tags = tags_of_question;
    }
    else if (target.className === "question-hyperlink") {
        var x = target.parentElement.parentElement;
        var q_tags = [];
        var addtags = x.getElementsByClassName('post-tag');
        for(var i=0;i<addtags.length;i++){
          var half = (addtags[i].innerText).split(">");
          q_tags.push(half[half.length - 1]);
        }
        result.activity = "ClickOnQuestion!";
        result.question = target.innerText;
        var q_post= x.parentElement;
        var votes = (q_post.getElementsByClassName('vote-count-post')[0].childNodes)[0].innerText;
        var answers = (q_post.getElementsByClassName('status')[0].childNodes)[1].innerText;
        var views_tag = (q_post.getElementsByClassName('views')[0].getAttribute('title')).split(" ")[0];
        result.views = views_tag;
        result.answers = answers;
        result.votes = votes;
        result.tags = q_tags;
    }
    else if(target.className.match(/^post-tag.*$/)) {
        result.activity = "TagClick!";
        result.tag = target.innerText;
    }
    else if (target.className === "page-numbers") {
        result.activity = "ChangePage!";
        result.tags = tags_of_question;
    }

    if (result.activity) {
        chrome.runtime.sendMessage(result, function(response) {
            console.log(result);
        });
    }
});
