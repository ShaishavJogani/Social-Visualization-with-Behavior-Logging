var sendPost = function(request) {
	$.ajax({
			type: 'POST',
			url: 'http://localhost:4000/logEvent',
			data : request,
	    dataType : 'json'
		// 	data: request,
    //       headers: {
		// 	          'Content-typeZ': 'application/x-www-form-urlencoded'
    //       }
		}
)};

function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}

//sending activity with a confirmation message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.log_event) {
			sendPost(request);
			sendResponse( {response: "valid user"} );
		}
		else {
			sendResponse( {response: "Invalid user"});
		}
	}
);
