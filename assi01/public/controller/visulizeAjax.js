$(document).ready(function() {
    $.when(
        getUserSessionData('/getSessionData'),
        getUserLogData('/getVisualizationData', true, 'QuestionClick'),
        getUserLogData('/getVisualizationData', true, 'UpVote'),
        getUserLogData('/getVisualizationData', true, 'DownVote'),
        getUserLogData('/getVisualizationData', true, 'Favorite'),
        getUserLogData('/getVisualizationData', true, 'UnFavorite'),
        getUserLogData('/getVisualizationData', false, 'QuestionClick'),
        getUserLogData('/getVisualizationData', false, 'UpVote'),
        getUserLogData('/getVisualizationData', false, 'DownVote'),
        getUserLogData('/getVisualizationData', false, 'Favorite'),
        getUserLogData('/getVisualizationData', false, 'UnFavorite')
    ).done(function(sessionData, UQClick, Uupvote, Udownvote, Ufav, UUnfav, QClick, upvote, downvote, fav, unfav){
        $('#username').text(sessionData[0].username);
        UQClick = UQClick[0];
        Uupvote =  Uupvote[0];
        Udownvote = Udownvote[0];
        Ufav = Ufav[0];
        UUnfav =     UUnfav[0];
        QClick = QClick[0];
        upvote = upvote[0];
        downvote = downvote[0];
        fav = fav[0];
        unfav = unfav[0];

        combineResult = {};
        dataArray = [];
        dataAllArray = [];

        for (id in UQClick) {
            object = {};
            object.tag = UQClick[id].tag;
            object.view = UQClick[id].count;
            object.upvote = getTagCount(Uupvote, object.tag);
            object.downvote = getTagCount(Udownvote, object.tag);
            object.fav = getTagCount(Ufav, object.tag);
            object.unfav = getTagCount(UUnfav, object.tag);
            object.total = object.upvote + object.downvote + object.fav + object.unfav;
            object.userstats = [{
            //     action: "Views",
            //     count: object.view
            // }, {
                action:"Upvote",
                count: object.upvote,
                percentage: (100*object.upvote / object.total).toFixed(2),
                engage: (100*object.upvote / object.view).toFixed(2)
             } , {
                        action:"Downvote",
                        count: object.downvote,
                        percentage: (100*object.downvote / object.total).toFixed(2),
                        engage: (100*object.downvote / object.view).toFixed(2)
                }, {
                    action:"Favorite",
                    count: object.fav,
                    percentage: (100*object.fav / object.total).toFixed(2),
                    engage: (100*object.fav / object.view).toFixed(2)
                },{
                    action:"Un-Favorite",
                    count: object.unfav,
                    percentage: (100*object.unfav / object.total).toFixed(2),
                    engage: (100*object.unfav / object.view).toFixed(2)
                }];
            dataArray.push(object);
        }

        for (id in QClick) {
            object = {};
            object.tag = QClick[id].tag;
            object.view = QClick[id].count;
            object.upvote = getTagCount(upvote, object.tag);
            object.downvote = getTagCount(downvote, object.tag);
            object.fav = getTagCount(fav, object.tag);
            object.unfav = getTagCount(unfav, object.tag);
            object.total = object.upvote + object.downvote + object.fav + object.unfav;
            object.userstats = [{
            //     action: "Views",
            //     count: object.view
            // }, {
                action:"Upvote",
                count: object.upvote,
                percentage: (100*object.upvote / object.total).toFixed(2),
                engage: (100*object.upvote / object.view).toFixed(2)
             } , {
                        action:"Downvote",
                        count: object.downvote,
                        percentage: (100*object.downvote / object.total).toFixed(2),
                        engage: (100*object.downvote / object.view).toFixed(2)
                }, {
                    action:"Favorite",
                    count: object.fav,
                    percentage: (100*object.fav / object.total).toFixed(2),
                    engage: (100*object.fav / object.view).toFixed(2)
                },{
                    action:"Un-Favorite",
                    count: object.unfav,
                    percentage: (100*object.unfav / object.total).toFixed(2),
                    engage: (100*object.unfav / object.view).toFixed(2)
                }];
            dataAllArray.push(object);
        }
        combineResult.userResult = dataArray;
        combineResult.Result = dataAllArray;


        //
        // combineResult.uqclick = UQClick;
        // combineResult.uup = Uupvote;
        // combineResult.udown = Udownvote;
        // combineResult.ufav = Ufav;
        // combineResult.uunfav = UUnfav;
        // combineResult.qclick = QClick;
        // combineResult.up = upvote;
        // combineResult.down = downvote;
        // combineResult.fav = fav;
        // combineResult.unfav = unfav;

        console.log(combineResult);
        displayVisualization(combineResult);
    });
});

function getTagCount(jsObject, tag) {
    var result = jsObject.find(obj => {
        return obj.tag === tag;
    });

    if(result) {
        return result.count;
    }  else {
        return 0;
    }

}

function getUserSessionData(pageurl) {
    return $.ajax({
          url: pageurl,
          type: "POST"
      });
}

function getUserLogData(pageurl, hasUser, activityEvent) {
    return $.ajax({
          url: pageurl,
          type: "POST",
          data: {
            userData : hasUser,
            activity: activityEvent
          }
      });
}
