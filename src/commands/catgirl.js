var request = require("request");
var cheerio = require("cheerio");

module.exports = {
    tag: "Fun",
    cooldown: 5,
    description: "Sends a message with a random catgirl",
    process: function(bot, msg, suffix){
        request("http://catgirls.brussell98.tk/", (error, response, body)=>{
            var cheerio = require("cheerio");
            var emojis = [":smiley_cat:",":smile_cat:",":joy_cat:",":kissing_cat:"]
            var meow = (Math.random() > 0.5) ? " **ニャー！**" : " **Nyaa~!**";
            try{
                var $ = cheerio.load(body);
                var link = $("img").attr("src");
                if(link.indexOf("/files/") == 0){
                    link = "http://catgirls.brussell98.tk/"+link;
                }
                bot.createMessage(msg.channel.id, link + meow + " " + emojis[Math.floor(Math.random()*emojis.length)] );
            }catch(e){
                bot.createMessage(msg.channel.id, ":no_entry: Uh oh! I ran into an error: "+e.stack);
            }
        });
    }
}
