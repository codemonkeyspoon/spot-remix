var youtubApiKey = 'AIzaSyDxtdMbk6LZWLUD55kDbiZK9yd5vcBCBJw';
var youtubeUrl = 'https://www.googleapis.com/youtube/v3/search';
var client_id = 'c0cb3e32a5f84f688b89b05ff48fd8f3';
var client_secret = '71019c8014f843f79bd4f7bea6167a05';

var searchInput = document.getElementById('searchInput');
var searchButton = document.getElementById('search-btn');



var authOptions = {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
};

fetch('https://accounts.spotify.com/api/token', authOptions)
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      var token = data.access_token;

      var options = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      };

      // Log the token response
      console.log('Access Token:', token);

      // Define the searchSongs() function in the global scope
      window.searchSongs = function() {
        // Get input value
        var query = document.getElementById('searchInput').value;

        // Make API request with the access token
        fetch(`https://api.spotify.com/v1/search?type=track&q=${query}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(response => response.json())
        .then(data => {
          console.log('Search Results:', data);
          // Clear previous results
          document.getElementById('searchResults').innerHTML = '';

          // Loop through search results and create list items
          data.tracks.items.forEach(track => {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.href = track.external_urls.spotify;
            link.target = '_blank';
            link.textContent = track.name;
            listItem.appendChild(link);
            document.getElementById('searchResults').appendChild(listItem);
            // add album art
            var img = document.createElement('img');
            img.src = track.album.images[0].url;
            listItem.appendChild(img);
          });
        })
        .catch(error => console.error('Error:', error));
      }
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

// add youtube api
function searchYoutube() {
  var query = document.getElementById('searchInput').value;
  fetch(`${youtubeUrl}?part=snippet&maxResults=10&q=${query}cover&key=${youtubApiKey}&safeSearch=strict&type=video&videoEmbeddable=true&videoLicense=youtube&videoSyndicated=true`)
  .then(response => response.json())
  .then(data => {
    console.log('Search Results:', data);
    displayYoutubeResults(data); // Call the displayYoutubeResults function with the search results data
  })
  .catch(error => console.error('Error:', error));
}

// displayYoutubeResults function to display YouTube search results
function displayYoutubeResults(data) {
  var results = data.items.map(function(item) {
    return item.id.videoId;
  });
  console.log(results);
  // Clear previous results
  document.getElementById('youtubeResults').innerHTML = ' ';
  // Loop through search results and create list items and show youtube videos
  results.forEach(function(result) {
    var listItem = document.createElement('li');
    var iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${result}`;
    listItem.appendChild(iframe);
    document.getElementById('youtubeResults').appendChild(listItem);
  });
}



// add event listener to search button
searchButton.addEventListener('click', function() {
  searchSongs();
  searchYoutube();
});
