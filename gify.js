var request = require('request');
var gifs = [];
var item = [Math.floor(Math.random()*25)];

	request("http://api.giphy.com/v1/gifs/search?q=cartoon&api_key=dc6zaTOxFJmzC", function(err, response, body) {
		var list = JSON.parse(body)
		for (i=0; i<25; i++){
			gifs.push(list.data[i].images.fixed_width["url"])
			};
		return(gifs[item])
	});
	