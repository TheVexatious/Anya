module.exports = {
    description: "Searches wikipedia for the given search terms",
    tag: "Fun",
    cooldown: 5,
    process: function(bot, msg, suffix){
        if(!suffix){
            return bot.createMessage(msg.channel, "Please try again with some search terms!");
        }
        var request = require("request");
        request(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${suffix.replace(/&/g, '')}&limit=1&namespace=0&format=json`, (error, response, body)=>{
            if(error){
                return bot.createMessage(msg.channel.id, "Uh-oh! got an error: "+error.message+" status code: "+response.statusCode);
            }
            var data = JSON.parse(body);
            if(!data || !data[1] || data[1] == "" || data[1] == undefined){
                return bot.createMessage(msg.channel.id, "No results for \""+suffix+"\"");
            }
            bot.createMessage(msg.channel.id, `__**${data[1][0]}**__\n\n${data[2][0]}\n${data[3][0]}`);
        });
    }
}
