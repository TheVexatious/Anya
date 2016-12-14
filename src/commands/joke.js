var request = require("request");

module.exports = {
    cooldown: 5,
    tag: "Fun",
    description: "Sends a random joke",
    process: function(bot, msg, suffix){
        request({url: "http://tambal.azurewebsites.net/joke/random", json: true}, (error, response, body)=>{
            if(error) return console.log(error);
            if(response.statusCode !== 200) return console.log("Got status code: "+response.statusCode);
            msg.channel.createMessage(body.joke);
        });
    }
}
