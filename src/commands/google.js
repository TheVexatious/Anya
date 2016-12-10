module.exports = {
    description: "Sends the first search result from the mentioned terms",
    usage: "<search-terms>",
    tag: "Fun"
    cooldown: 5,
    process: function(bot,msg,suffix){
        var google = require("google");
        if(!suffix){
            bot.createMessage(msg.channel.id, "The correct usage is `>google "+this.usage+"`");
            return;
        }
        google(suffix, (error, response) => {
            if(error || !response || !response.links || response.links.length < 1){
                bot.createMessage(msg.channel.id, "No results!");
            }else{
                if(response.links[0].link === null){
                    for(var i = 1; i < response.links.length; i++){
                        if(response.links[i].link !== null){
                            bot.createMessage(msg.channel.id, response.links[i].link);
                            return;
                        }
                    }
                }else bot.createMessage(msg.channel.id, response.links[0].link);
            }
        });
    }
}
