function annyangThread(callback){
  $.getScript("../annyang/annyang.js", function(){

        // Let's define our first command. First the text we expect, and then the function it should call
        var commands = {
            '(smart box) play (the song) *song': playSong,
            '(smart box) play (the song) *song by *artist': playSong,
             '(smart box) stop (the music)': stop,
              '(smart box) buy (me) *item' :buyOnEbay,
               '(smart box) Bring (me) food' : bringFood,
            '(smart box) show me (pictures of) *term' : showPhotos,
            '(smart box) google *term': function(term) {
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
           function buyOnEbay(keywordString){
              requestEbay(keywordString, function(data){
                callback(data);
              });
           }

           function bringFood(){
           document.getElementById('food').className="ordrin-embed";

           }

           function showPhotos(keywordString){
              requestFlickr(keywordString,function(data){
                callback(data)
              });
           }


          var audio = null;
          function playSong(song, artist) {
              console.log("PlaySong", song);
              var req = new XMLHttpRequest();
              req.open('GET', 'https://api.spotify.com/v1/search?type=track&q=' + encodeURIComponent(song), true);
              req.onreadystatechange = function() {
                  if (req.readyState == 4 && req.status == 200){
                      var data = JSON.parse(req.responseText);
                      var textField = document.getElementById('searchinput').value;
                      if (data.tracks.items[0]) {
                          stop();
                          var matchedElement = document.getElementById('matched');
                              // console.log("reached");
                              // console.log(data);
                              var imgURL=data.tracks.items[0].album.images[0].url||data.tracks.items[0].album.name;
                              var artistName= data.tracks.items[0].artists[0].name;
                              // console.log(imgURL);
                              // console.log(artistName);
                              // console.log(song);
                              var apistructure = {"APItype":"SPOTIFY",
                                                  "meta": {"imgURL":imgURL, "song":song, "artistName":artistName}};
                              // console.log(apistructure);
                              audio = new Audio(data.tracks.items[0].preview_url);
                              callback(apistructure);
                              audio.play();
                      }
                  }
              };
              req.send(null);
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

  });
};