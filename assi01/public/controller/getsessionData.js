$(document).ready(function() {
    $.ajax({
        url: "/getSessionData",
        type: "POST"
    }).then(function(data) {
      console.log(data);
       $('#username').text(data.username);

       activitiesLength = data.loginActivity.length;
       for (var i= activitiesLength -1; i >=0 ; i--) {
          $('#loginTable').append('<tr><td>' + data.loginActivity[i] + '</td></tr>');
       }
    });
});
