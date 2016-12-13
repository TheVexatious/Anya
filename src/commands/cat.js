var request = require("request");

module.exports = {
    tag: "Fun",
    cooldown: 5,
    description: "Sends a message with a random cat",
    process: function(bot,msg,suffix){
        var request = require("request");
        request("http://random.cat/meow", function(error, response, body){
            if(!error && response.statusCode == 200){
                var catpic = JSON.parse(body);
                bot.createMessage(msg.channel.id, catpic.file);
            }else{
                console.log("Got an error: "+error+", status code: "+response.statusCode);
            }
        });
    }
}
