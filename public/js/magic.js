$(document).ready(function() {

  var myLatlng = new google.maps.LatLng(49.278893, -123.115883);
  var myOptions = {
    zoom: 14,
    center: myLatlng,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  $("#form_link").click(function() {
    $("#form_container").show();
    return false;
  });

  $("#cancel").click(function() {
    $("#form_container").hide();
    return false;
  });

  $("#form").load(function() {
    console.log("load");
  });
});