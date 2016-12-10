module.exports = {
    execute: function(bot, guild){
        console.log(`Added to "${guild.name}", new guild count: ${bot.guilds.size}`);
    }
}
