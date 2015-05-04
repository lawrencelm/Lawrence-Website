var wrapper;

var cb_log = function(data){
    var items = data.findItemsByKeywordsResponse[0].searchResult[0].item || [];
    var searchresults = [];
    for (var i = 0; i < items.length; ++i) {
        var item     = items[i];
        console.log(i);
        if (item.sellingStatus[0].currentPrice[0]['__value__']&&item.title&&item.galleryPlusPictureURL||item.galleryURL){
            var price    = item.sellingStatus[0].currentPrice[0]['__value__'];
            var name    = item.title;//item.title refers to NAME of item
            var pic      = item.galleryPlusPictureURL || item.galleryURL;
            var URL      = item.viewItemURL;
            console.log(URL);
            // console.log(price);
            // console.log(pic);
            // console.log(name);
            searchresults.push({"title":price, "subtitle":name, "pic":pic, "url":URL});//IMPORTANT: title is name of item
        }																				//subtitle is the price.
    }
    var apiData = {"APItype":"EBAY", "list":searchresults};
    console.log(apiData);
    wrapper(apiData);
}

var requestEbay = function(keywordString, callback) { //callback takes response object as parm
    keywordString = keywordString.split(' ').join('%20');
    console.log(keywordString);
    wrapper = callback;
    console.log(wrapper);

	var url = "http://svcs.ebay.com/services/search/FindingService/v1";
	    url += "?OPERATION-NAME=findItemsByKeywords";
	    url += "&SERVICE-VERSION=1.0.0";
	    url += "&SECURITY-APPNAME=DucNguye-db45-4205-adda-a7cf5ef17a5e";
	    url += "&GLOBAL-ID=EBAY-US";
	    url += "&RESPONSE-DATA-FORMAT=JSON";
	    url += "&callback=cb_log";
	    url += "&REST-PAYLOAD";
	    url += "&keywords=" + keywordString;
	    url += "&paginationInput.entriesPerPage=20";

    var s = document.createElement('script');
    s.src = url;
    document.body.appendChild(s);
}

//temp

/*var url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME=DucNguye-db45-4205-adda-a7cf5ef17a5e";
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&callback=cb_log";
    url += "&REST-PAYLOAD";
    url += "&keywords=" + 'sports';
    url += "&paginationInput.entriesPerPage=50";

/*var HttpClient = function (){
	this.get = function(aurl, aCallback){
		var req = new XMLHttpRequest();
		req.onreadystatechange = function(){
			if(req.readyState==4 && req.status==200)
				aCallback(req.responseText);
		}
		req.open('GET', aurl, true);
		req.send(null);
	}
}

var newreq = new HttpClient();
newreq.get(urlhalf1,function(x){
	console.log(x);
	}
);
console.log("hello");
console.log("hello");*/


/*$(document).ready(function() {
    $.ajax(
	{
	    url: "http://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=DucNguye-db45-4205-adda-a7cf5ef17a5e&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=iphone%203g&paginationInput.entriesPerPage=3",
	    type: 'GET',
	    dataType: 'json',
	    accept: 'application/json',
	    success: function(data)
	    {  
	        console.log(data);
	        var objets= $.parseJSON(data);

	        $.each(objets, function(i, obj)
	        {
	           console.log(obj.title);
	        });
	    }
	});
});*/
