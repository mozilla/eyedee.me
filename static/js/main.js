function showMain() {
  $(".content").hide();
  $(".content#main").fadeIn(400);
}

function showAuthed() {
}

$(document).ready(function() {
  $(".signin").click(function(ev) {
    ev.preventDefault();
    $(".content").hide();
    $(".content#signup").fadeIn(400);
  });

  function showError(err) {
    $("#signup div.error").hide().text(err).fadeIn(600);
    $("form button").removeAttr('disabled');
  }

  $("form").submit(function() {
    $("#signup div.error").hide();
    $("form button").attr('disabled', true);

    var uname = $.trim($("form #username").val());
    var pass = $.trim($("form #password").val());
    if (!uname.length) return showError("please supply a username");
    if (pass.length < 6) return showError("password is too short");

    $.ajax({
      url: '/api/signin',
      type: 'POST',
      dataType: 'json',
      data: {
        user: uname,
        pass: pass
      },
      success: function() {
        alert("woohoo");
      },
      error: function() {
        alert("no love");
      }
    });
  });

  // check if we're authed!
  $.ajax({
    url: '/api/whoami',
    dataType: 'json',
    success: function(r) {
      try {
        var user = JSON.parse(r).user;
        if (!user) throw "nope";
        showAuthed(user);
      } catch(e) {
        showMain();
      }
    },
    error: function() {
      showMain();
    }
  });
});