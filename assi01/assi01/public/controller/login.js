$('#loginForm')
  .ajaxForm({
    url : 'http://localhost:4000/users/authenticate',
    type : "POST",
    data : $('#loginForm').serialize(),
    dataType : 'json',
    success : function (response) {
      console.log(response);    
    },
    error: function ( response){
      alert("error: " + response);
    }
  });

  function getData() {
      // Grab the template
      $.get('./homepage.ejs', function (template) {
          // Compile the EJS template.
          var func = ejs.compile(template);

          // Grab the data
          $.get('/data', function (data) {
             // Generate the html from the given data.
             var html = func(data);
             $('#divResults').html(html);
          });
      });
  }
