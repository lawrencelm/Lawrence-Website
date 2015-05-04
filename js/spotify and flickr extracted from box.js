 
        
             
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
      'play (the song) *song': playSong,
      'play (the song) *song by *artist': playSong,
       'stop (the music)': stop, 
       'who made you (star box)' : askquestion1,
      'show me (pictures of) *term' : showFlickr,
      'google *term': function(term) {
          var win = window.open('https://www.google.com/#q='+term, '_blank');
if(win){
    //Browser has allowed it to be opened
    win.focus();
}else{
    //Broswer has blocked it
    alert('Please allow popups for this site');
}
  }
      
  };
     
     function askquestion1(){
         
     }

        
        
  function showFlickr(tag) {
      var url = '//api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e885e3321945f751d5ffd8e5e4405def&sort=interestingness-desc&per_page=9&format=json&callback=jsonFlickrApi&tags='+tag;
      $.ajax({
        type: 'GET',
        url: url,
        async: false,
        jsonpCallback: 'jsonFlickrApi',
        contentType: "application/json",
        dataType: 'jsonp'
      });
    };

    var jsonFlickrApi = function(results) {
      $('#flickrLoader p').fadeOut('slow');
      var photos = results.photos.photo;
      $.each(photos, function(index, photo) {
        $(document.createElement("img"))
          .attr({ src: '//farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_s.jpg' })
      });
    };
     
    var audio = null;
    function playSong(song, artist) {
        var recognizedElement = document.getElementById('recognized');
        recognizedElement.innerText = 'Recognized "' + song + (artist ? ' by ' + artist : '') + '"';
        console.log("PlaySong", song);
        var req = new XMLHttpRequest();
        req.open('GET', 'https://api.spotify.com/v1/search?type=track&q=' + encodeURIComponent(song), true);
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200){
                var data = JSON.parse(req.responseText);
                var textField = document.getElementById('search').value;
                if (data.tracks.items[0]) {
                    stop();
                    var matchedElement = document.getElementById('matched');
                    console.log("reached");
                    matchedElement.innerHTML = '<div class="media"><img src="' + data.tracks.items[0].album.images[0].url + '" alt="Cover art of ' + data.tracks.items[0].album.name + '" width="300"><p>Playing ' + data.tracks.items[0].name + ' by ' + data.tracks.items[0].artists[0].name +'</p></div>';
                    audio = new Audio(data.tracks.items[0].preview_url);
                    audio.play();
                }
            }
        };
        req.send(null);
    }

    var feelMood = function(){
        if(concentrated) {
            console.log('it is concentrated');
        } 
        if(!concentrated) {
            console.log('NOT concentrated');
        }
    }

    function stop() {
        if (audio) {
            audio.pause();
            audio = null;
        }
    } 
        
    // Add our commands to annyang
    annyang.addCommands(commands);
    
  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
  annyang.debug();

        
        
        
        