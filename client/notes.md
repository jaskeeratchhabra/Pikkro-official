     var map;
      var marker1;
      var marker2;
      
      function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: 0, lng: 0 },
              zoom: 2
          });
      
          marker1 = new google.maps.Marker({
              position: { lat: 0, lng: 0 },
              map: map,
              draggable: true
          });
      
          marker2 = new google.maps.Marker({
              position: { lat: 0, lng: 0 },
              map: map,
              draggable: true
          });
      
          google.maps.event.addListener(marker1, 'dragend', updateMarkerPosition);
          google.maps.event.addListener(marker2, 'dragend', updateMarkerPosition);
      }
      
      function updateMarkerPosition() {
          var position1 = marker1.getPosition();
          var position2 = marker2.getPosition();
          document.getElementById('address1').value = ''; // Clear the input fields
          document.getElementById('address2').value = '';
      }
      
      function geocodeAndCalculateDistance() {
          var geocoder = new google.maps.Geocoder();
          var address1 = document.getElementById('address1').value;
          var address2 = document.getElementById('address2').value;
      
          if (address1 === '' || address2 === '') {
              alert('Please enter both addresses.');
              return;
          }
      
          geocoder.geocode({ 'address': address1 }, function (results1, status1) {
              if (status1 === 'OK' && results1[0]) {
                  marker1.setPosition(results1[0].geometry.location);
      
                  geocoder.geocode({ 'address': address2 }, function (results2, status2) {
                      if (status2 === 'OK' && results2[0]) {
                          marker2.setPosition(results2[0].geometry.location);
                          calculateDistance();

                          var button = document.getElementById('getSummery');

// Set the display property to 'block'
button.style.display = 'block';
                          
                      } else {
                          alert('Geocode for Address 2 failed: ' + status2);
                      }
                  });
              } else {
                  alert('Geocode for Address 1 failed: ' + status1);
              }
          });
      }
      
      function calculateDistance() {
          var position1 = marker1.getPosition();
          var position2 = marker2.getPosition();
          var distance = google.maps.geometry.spherical.computeDistanceBetween(position1, position2);
      
          sessionStorage.setItem('distance', distance.toFixed(2));
          alert('Distance between the two points: ' + distance.toFixed(2) + ' meters');
      }
      
      google.maps.event.addDomListener(window, 'load', initMap);