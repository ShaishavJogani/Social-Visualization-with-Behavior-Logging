$(document).ready(function() {
    $.ajax({
        url: "/getSessionData",
        type: "POST"
    }).then(function(data) {
      console.log(data);
       $('#username').text(data.username);

       activitiesLength = data.loginActivity.length;
       for (var i= activitiesLength -1; i >=0 ; i--) {
          $('#loginTable').append('<tr class="row100 body"><td class="cell100 column1">' + (activitiesLength-i) + '</td>' +
          '<td class="cell100 column2">' + data.loginActivity[i] + '</td></tr>');
       }
    });
});

function dayOfWeekAsString(dayIndex) {
  return ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][dayIndex];
}
