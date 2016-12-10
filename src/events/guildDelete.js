module.exports = {
    execute: function(bot, guild){
        console.log(`Removed from"${guild.name}", new guild count: ${bot.guilds.size}`);
    }
}
