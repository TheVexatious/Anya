var request = require("request");

module.exports = {
    tag: "Fun",
    cooldown: 5,
    description: "Sends a message with a random penguin",
    process: function(bot, msg){
        var request = require("request");
        request("http://penguin.wtf/", function(error, response, body){
            if(!error && response.statusCode == 200){
                var penguin = String(body);
                bot.createMessage(msg.channel.id, penguin);
            }else{
                console.log("Got an error: "+error+", status code: "+response.statusCode);
            }
        });
    }
}
