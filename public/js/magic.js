ClusterIcon.prototype.triggerClusterClick = function() {
  var markerClusterer = this.cluster_.getMarkerClusterer();

  // Trigger the clusterclick event.
  google.maps.event.trigger(markerClusterer, 'clusterclick', [this.cluster_]);

  VanTechMap.toggleInfoWindow(this.cluster_.getCenter());
};

var VanTechMap = {
  map: null,
  markers: null,
  geocoder: new google.maps.Geocoder(),
  mc: null,
  infoWindows: null,
  numberOfMarkers: null,
  initialize: function() {
    var startLatlng = new google.maps.LatLng(49.278893, -123.115883);
    var mapOptions = {
      zoom: 14,
      center: startLatlng,
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.markers = [];
    this.infoWindows = [];
    this.numberOfMarkers = 0;

    VanTechMap.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  },
  addCompany: function(entry) {
    var address = entry.gsx$address_2.$t.replace(new RegExp("\\n", "g"), " ");

    VanTechMap.geocoder.geocode( { 'address': address},
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var geo_location = results[0].geometry.location;

          var marker = new google.maps.Marker({
            position: geo_location
          });

          VanTechMap.addMarker(marker);
          VanTechMap.addInfoLocation(geo_location, entry);
          // Add click event handler for normal markers rather than clustered ones
          google.maps.event.addListener(marker, 'click', function() {
            VanTechMap.toggleInfoWindow(marker.getPosition());
          });
        } else {
          console.log("Geocode was not succesful for the following reason : " + status);
        }
      }
    );
  },
  renderCompanies: function(json) {
    $.each(json.feed.entry, function(i, entry) {
      VanTechMap.addCompany(entry);
    });

    var mcOptions = {gridSize: 50, maxZoom: 20, zoomOnClick: false};

    VanTechMap.mc = new MarkerClusterer(VanTechMap.map, VanTechMap.markers, mcOptions);
  },
  addMarker: function(marker) {
    VanTechMap.mc.addMarker(marker);
    VanTechMap.numberOfMarkers++;
  },
  addInfoLocation: function(geo_location, entry) {
    console.log(entry);
    var company_info = null;
    if (entry.gsx$companywebsite) {
      company_info = "<h3 class='map_company_name'><a href='"+ entry.gsx$companywebsite.$t
      +"' target='_blank'>" + entry.gsx$companyname_2.$t + "</a></h3>";
    }
    else {
      company_info = "<h3 class='map_company_name'>" + entry.gsx$companyname_2.$t + "</h3>";
    }

    if (entry.gsx$whatdoyoudo) {
      company_info = company_info + "<p class='map_comany_info'>" + entry.gsx$whatdoyoudo.$t + "</p>";
    }

    if (VanTechMap.infoWindows[geo_location]) {
      var infowindow = VanTechMap.infoWindows[geo_location]
      infowindow.setContent(infowindow.getContent() + company_info);
    }
    else {
      VanTechMap.infoWindows[geo_location] = new google.maps.InfoWindow({
        content: company_info,
      });
      VanTechMap.infoWindows[geo_location].setPosition(geo_location);
    }
  },
  toggleInfoWindow: function(geo_location) {
    var infowindow = VanTechMap.infoWindows[geo_location];

    // $.each(VanTechMap.infoWindows, function(i, infowindow) {
    //   console.log(infowindow);
    // });

    if (infowindow.view) {
      infowindow.close();
    }
    else {
      infowindow.open(VanTechMap.map);
    }
  }
}

$(document).ready(function() {
  VanTechMap.initialize();

  $("#form_link").click(function() {
    $("#form_container").show();
    return false;
  });

  $("#cancel").click(function() {
    $("#form_container").hide();
    return false;
  });

  $("#spreadsheet_src").attr("src", "https://spreadsheets.google.com/feeds/list/0AiraKKMVEVKfdHY0Q1VEeE4xTkRqY2RKYTItX19HNXc/od6/public/values?alt=json-in-script&callback=VanTechMap.renderCompanies");
});