var youtube_node = require("youtube-node");
var youtubeApiKey = require("../../config.json").googleApiKey;

module.exports = {
	execute: function(query, type, callback){
		var cb = "";
		var youtube = new youtube_node();
		youtube.setKey(youtubeApiKey);
		if(type && type !== undefined && type !== null) youtube.addParam("type", type)
		else youtube.addParam("type", "video");
		youtube.search(query, 1, (error, result) => {
			if(error) return console.log(error)
			else {
				if (!result || !result.items || result.items.length < 1) {
					cb = "No results!";
				}else{
					switch(result.items[0].id.kind){
						case "youtube#video":
							cb = ("http://www.youtube.com/watch?v=" + result.items[0].id.videoId);
							break;
						case "youtube#channel":
							cb = ("http://www.youtube.com/channel/" + result.items[0].id.channelId);
							break;
						case "youtube#playlist":
							cb = ("http://www.youtube.com/playlist?list=" + result.items[0].id.playlistId);
					}
				}
				callback(cb);
			}
		});
	}
}
