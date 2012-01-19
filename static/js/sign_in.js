$(document).ready(function() {
  navigator.id.beginAuthentication(function(email) {
    $(".email").text(email);

    // check if that email exists here
    $.ajax({
      url: '/api/have_user',
      data: {
        user: email.replace('@eyedee.me', '')
      },
      type: 'GET',
      dataType: "json",
      success: function(r) {
        if (r.known) {
          $("#main").show();
        } else {
          $("#no_such_user").show();
        }
      },
      error: function(r) {
      }
    });
  });
});
