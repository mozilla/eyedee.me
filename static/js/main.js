$(document).ready(function() {
  $(".content#main").fadeIn(400);

  $(".signin").click(function() {
    $(".content").hide();
    $(".content#signup").fadeIn(400);
  });
});