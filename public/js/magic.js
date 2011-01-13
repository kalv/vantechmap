var geocoder = new google.maps.Geocoder();
var map;

function addCompany(entry) {
  console.log(entry);

  var address = entry.gsx$address_2.$t.replace(new RegExp("\\n", "g"), " ");

  console.log(address);
  geocoder.geocode( { 'address': address},
    function(results, status) {
      console.log(status);
      if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        console.log("Geocode was not succesful")
      }
    }
  );
}

function renderCompanies(json) {
  $.each(json.feed.entry, function(i, entry) {
    addCompany(entry)
  });
}

$(document).ready(function() {

  var myLatlng = new google.maps.LatLng(49.278893, -123.115883);
  var myOptions = {
    zoom: 14,
    center: myLatlng,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  $("#form_link").click(function() {
    $("#form_container").show();
    return false;
  });

  $("#cancel").click(function() {
    $("#form_container").hide();
    return false;
  });
});