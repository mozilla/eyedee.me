function showMain() {
  $("#header .state .in").hide();
  $("#header .state .out").show();
  $(".content").hide();
  $(".content#main").fadeIn(400);
}

function showAuthed(user) {
  $(".content").hide();
  $(".content#manage").fadeIn(400);
  $(".username").text(user);
  $("#header .state .out").hide();
  $("#header .state .in").show();
}

$(document).ready(function() {
  $(".signin").click(function(ev) {
    ev.preventDefault();
    $(".content").hide();
    $("#signup input").val("");
    $("#signup button").removeAttr('disabled');
    $(".content#signup").fadeIn(400);
  });

  $("#header .state .logout").click(function() {
    $.ajax({
      url: '/api/signout',
      success: showMain,
      error: showMain
    });
  });

  function showError(err) {
    $("#signup div.error").hide().text(err).fadeIn(600);
    $("form button").removeAttr('disabled');
  }

  $("form").submit(function(e) {
    e.preventDefault();
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
        showAuthed(uname);
      },
      error: function() {
        showError("authentication failure");
      }
    });
  });

  // check if we're authed!
  $.ajax({
    url: '/api/whoami',
    dataType: 'json',
    success: function(r) {
      try {
        if (!r.user) throw "nope";
        showAuthed(r.user);
      } catch(e) {
        showMain();
      }
    },
    error: function() {
      showMain();
    }
  });
});
