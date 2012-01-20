$(document).ready(function() {
  navigator.id.beginAuthentication(function(email) {
    $(".email").text(email);
    var user = email.replace('@eyedee.me', '')

    // check if that email exists here
    $.ajax({
      url: '/api/have_user',
      data: { user: user },
      dataType: "json",
      success: function(r) {
        if (r.known) $("#main").show();
        else $("#no_such_user").show();
      },
      error: function(r) {
        $("#no_such_user").show();
      }
    });

    // all cancel buttons work the same
    $("form button.cancel").click(function(e) {
      e.preventDefault();
      navigator.id.raiseAuthenticationFailure("user canceled authentication");
    });

    // this submission hook will actually apply to two buttons:
    //
    // one handles the case where an email address is known, and
    // the user is signing in with it ("#main form").submit
    //
    // the other handles the case where an email addres is *not* known,
    // and we create the account for the user and log them in in one fell swoop
    // ("#no_such_user form").submit
    //
    // Note to reader: this may be too magic?  we could remove this functionality and
    // just make the user go to eyedee.me and create their account.  This behaviore
    // is probably what will happen in the Real World
    $("form").submit(function(e) {
      e.preventDefault();

      // figure out which password field they entered their password into
      var pass = $.trim($("#main input").val()) || $.trim($("#no_such_user input").val())

      // validate password client side
      if (pass.length < 6) {
        $("div.error").hide().text("Yikes, Passwords have to be at least 6 characters").fadeIn(600);
        return;
      }

      $.ajax({
        url: '/api/signin',
        type: 'POST',
        dataType: 'json',
        data: { user: user, pass: pass },
        success: function() {
          // User is authenticated!  Let's call .completeAuthentication() and send
          // them on their way
          navigator.id.completeAuthentication();
        },
        error: function() {
          // This is a terrible password.
          $("div.error").hide().text("Yikes, that password looks wrong.  Try again.").fadeIn(600);
        }
      });
    });
  });
});
