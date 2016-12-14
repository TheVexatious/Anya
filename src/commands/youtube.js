module.exports = {
    description: "Sends the first search result from the mentioned terms from youtube",
    usage: "<search-terms> (--video | --channel | playlist)",
    tag: "Fun",
    cooldown: 5,
    process: function(bot, msg, suffix, plugins){
        if(!suffix) return bot.createMessage(msg.channel.id, "Please enter the search terms!");
        var type = "video";
        if(msg.content.match(/--video$|--channel$|--playlist|$\w/g) && msg.content.match(/--video$|--channel$|--playlist|$\w/g) !== null){
            type = msg.content.match(/--video$|--channel$|--playlist|$\w/g)[0].substring(2);
            suffix = suffix.replace(/--video$|--channel$|--playlist|$\w/g, "");
        }
        plugins["youtube"].execute(suffix, type, (video) => {
            msg.channel.createMessage(video);
        });
    }
}
