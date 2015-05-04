requestFlickr = function(keywordString,callback){
  var url = 'https://secure.flickr.com/services/rest/?';
      url +='method=flickr.photos.search&';
      url +='api_key=02970fe33b397f5ac3934bdd232d1302&';
      url +='text=' + encodeURIComponent(keywordString) + '&';
      url +='safe_search=1&';
      url +='content_type=1&';
      url +='sort=interestingness-desc&';
      url +='per_page=20';

  var req = new XMLHttpRequest();
  req.open("GET", url, false);
  req.send(null);

  console.log(url);

  var kittens = req.responseXML.querySelectorAll('photo');
  //console.log(kittens);
  var photos = []
  for (var i = 0; i < kittens.length; i++) {
    var photo = kittens[i];
    //getting image title
    imgTitle=photo.getAttribute('title');
    //getting image URL
    imgURL = "http://static.flickr.com/" + photo.getAttribute("server") +
    "/" + photo.getAttribute("id") +
    "_" + photo.getAttribute("secret") +
    "_s.jpg";
    //getting image page
    webpage = "http://www.flickr.com/photos/"+photo.getAttribute("owner")+"/"+photo.getAttribute("id");
    console.log(webpage);
    
    photos.push({"title":imgTitle,"pic":imgURL, "url":webpage})
  }
  apistructure={"APItype":"FLICKR", "list":photos}
  callback(apistructure);
}