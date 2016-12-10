var request = require("request");

module.exports = {
    usage: "<tag>",
    tag: "Fun",
    cooldown: 5,
    description: "Posts a random gif related to the given tags, if no tags are written the gif will be random",
    process: function(bot,msg,suffix){
        if(suffix){
            var request = require("request");
            request("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag="+suffix,function(error,response,body){ // API Key is default giphy api key
                if(error){
                    bot.createMessage(msg.channel.id, "Got an error: "+error+" status code: "+response.statusCode);
                }else{
                    var gif = JSON.parse(body);
                    bot.createMessage(msg.channel.id, gif.data.url);
                }
            });
        }else{
            var request = require("request");
            request("http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC", function(error, response, body){ // // API Key is default giphy api key
                if(error){
                    bot.createMessage(msg.channel.id, "Got an error: "+error+" status code: "+response.statusCode);
                }else{
                    var gif = JSON.parse(body);
                    bot.createMessage(msg.channel.id, gif.data.url)
                }
            });
        }
    }
}
