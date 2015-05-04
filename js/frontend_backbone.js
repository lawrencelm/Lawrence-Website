//BACKBONE//

var Result_Item = Backbone.Model.extend({
    initialize: function() {
    },
    parse: function(data) {
        this.model.set('URL', data.attributes.URL[0]);
        //this.model.set('pic', data.attributes.pic[0]);
        this.model.set('title', data.attributes.title[0]);
        console.log(this);
        return this;
    }
});

var Results = Backbone.Collection.extend({
    model: Result_Item,
    parse: function() {
    },
    initialize: function() {
        var view;

        setTimeout(function() {
        this.view = new Result_View({collection:this});
        var element = this.view.render().$el;
        $('#resultContainer').append(element);
        console.log(element);
        }.bind(this), 100);
    },
    move: function() {
        this.view.move();
    }
});


var Result_View = Backbone.View.extend({
    initialize: function() {
        $('body').keypress(function(e) {
            if (e.keyCode === 13 && this.rendered)
                $(this.$el).addClass('moved');
        }.bind(this));
    },
    move: function() {
        if (this.rendered)
                $(this.$el).addClass('moved');
    },
    makeRow: function() {
        console.log('result_view');
        return $(document.createElement('div')).addClass('row');
    },
    rendered: false,
    render: function() {
        var elementsWrapper = document.createElement('div');
        var row = this.makeRow();
        console.log(this.collection)
            for (var i = 0; i < this.collection.length; i++) {
                //console.log(this.collection.models[i].attributes.URL[0])
                row.append(new Result_Item_View({model: this.collection.models[i]}).render().$el);
                if ((i + 1) % 4 === 0) {
                    $(elementsWrapper).append($(row));
                    row = this.makeRow();
                }
            }
            if (!((i+1) % 4 === 0)) $(elementsWrapper).append($(row));
            $(elementsWrapper).addClass('resultCollection');
            console.log(elementsWrapper);
            this.$el = elementsWrapper;
        this.rendered = true;
        return this;
    }
});

var Result_Item_View = Backbone.View.extend({
    tagName: "div",
    className: "result_item panel panel-default col-md-3",
    initialize: function() {
        //console.log('result_item_view');
        this.template = _.template($('#result_item').html());
        $('#result_item').css({'display': 'inline-block'});
    },
    render: function() {
        console.log(this);
        this.$el.html(this.template(this.model.attributes));
        console.log(this);
        return this;
    }
});
 
var Spotify_Item = Backbone.Model.extend({
    initialize: function() {
        setTimeout(function() {
        this.view = new Spotify_View({model: this});
        var element = this.view.render().$el;
        $('#resultContainer').append(element);
        }.bind(this), 100);

        //this.on({'change':this.view.update})
    },
    move: function() {
        this.view.move();
    },
    modify: function(meta) {
        this.set({'imgURL':meta.imgURL});
        this.set({'song':meta.song});
        this.set({'artistName':meta.artistName});
    }
});

var Spotify_View = Backbone.View.extend({
    tagName: "div",
    id: "spotifyelement",
    initialize: function() {
        this.template = _.template($('#spotifyelement').html());
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    move: function() {
        $(this.$el).addClass('moved');
    }
});

//END BACKBONE//


//pure jQuery part: SEARCH///
var searchMoved = false;
$(document).ready(function() {
    var submitState = function() {
        $('.searchLanding, #navigation, .searchbox').addClass('submitted');
    }

    var content;

    annyangThread(function(response) {
        submitState();
        generate(response);
    });
    
    function generate(response) {
                /*$('#navigationText>a').append('<span id="query">' + query + '</span>');*/
                /*$('#searchPrefix').css({'display': 'inline-block'});*/

                //currently not useful.
                var determineSearchMoved = function() {
                    if ($('.searchbox').css('margin-top') === margin_searchAtTop)
                        searchMoved = true;
                }

                var determineAPIView = function() {
                    switch(response.APItype) {
                        case "EBAY":
                            $(response.photos).each(function(index, item) {
                                item.title = "$"+item.title;
                            });
                            console.log(response.list);
                            content = new Results(response.list);
                            margin_searchAtTop = $(this).css('margin-top'); //currently not useful.
                            break;
                        case "FLICKR":
                            // $(response.list).each(function(index, item) {
                            //      item.pic = item.pic.substring(http://:8000/static.flickr.com/7406/10126462554_8b2cf66976_s.jpg);
                            // });
                            console.log(response.list);
                            content = new Results(response.list);
                            margin_searchAtTop = $(this).css('margin-top'); //currently not useful.
                            break;
                        case "SPOTIFY":
                            console.log(response.meta);
                            content = new Spotify_Item(response.meta);
                            content.modify(response.meta);
                            break;
                    }
                }
                if (content) content.move();
                determineAPIView();
                /*if(!searchMoved) {
                    $(".searchbox").on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', 
                        function() {
                            console.log('reached end of transition already');
                            determineAPIView();}
                    );
                }
                else determineAPIView();*/
            }

    $('body').keypress(function(e) {
        if (e.keyCode === 13) {
            var response;
            var query = $('#searchinput').val();

            if (query.substring(0,"buy".length)==="buy") {
                query = query.substring("buy".length + 1);
                submitState();
                requestEbay(query, function(data) {
                    response = data;
                    generate(response);
                });
            }

            else if (query.substring(0,"show me".length)==="show me") {
                query = query.substring("show me".length + 1);
                submitState();
                requestFlickr(query, function(data) {
                    response = data;
                    generate(response);
                });
            }

            else if (query.substring(0,"play".length)==="play") {
                query = query.substring("play".length + 1);
                submitState();

            }
        }
    });

    $('#login-button').click(function() {
        $('#login-modal').removeClass('hidden');
    });

    $(document).on("submit", ".submitLogin", function(e) {
        e.preventDefault();
        var username = document.getElementById('inputUsername').value;     
        var password = document.getElementById('inputPassword').value;
        var email = document.getElementById('inputEmail').value;
        var user = new Parse.User();
        user.set('username', username);
        user.set('password', password);
        user.set('email', email);
        console.log(user);
        user.signUp(null, {
            success: function(user) {
            // Hooray! Let them use the app now.
            },
            error: function(user, error) {
            // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });

});

//LOGIN//