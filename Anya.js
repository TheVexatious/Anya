const Eris = require("eris");

var fs = require("fs");
var path = require("path");
var config = require("./config.json");
var reload = require("require-reload")(require);

var bot = new Eris(config.token);

var commandsProcessed = 0;
var cleverResponses = 0;
var commands = {};
var events = {};
var plugins = {};

function processEvent(val){
    if(val == "messageCreate"){
        bot.on(val, (msg)=>{
            if(msg.content.startsWith(config.prefix + "reload") && msg.author.id == config.ownerId){
                var suffix = msg.content.substring(config.prefix.length + 6).trim();
                if(!commands[suffix]) return msg.channel.createMessage(`Command **${suffix}** does not exist!`);
                var neew;
                try{
                    neew = reload(`./commands/${suffix}.js`)
                }catch(e){
                    return console.log("Error: "+e);
                }
                delete commands[suffix];
                commands[suffix] = neew;
                msg.channel.createMessage(`Sucessfully reloaded command **${suffix}**!`);
            }
            if(msg.content.startsWith(config.prefix + "eval") && msg.author.id == config.ownerId){
                evaluate(msg, (result) => {
                    msg.channel.createMessage(result);
                    if(msg.channel.guild) console.log(msg.channel.guild.name+" : #"+msg.channel.name+" : "+msg.author.username+" : "+msg.cleanContent.replace(/\n/g, " "));
                	else console.log(msg.author.username+" : "+msg.cleanContent.replace(/\n/g, " "));
                });
            } else events.messageCreate.execute(bot, msg, config, commands, {commands: commandsProcessed, cleverbots: cleverResponses}, plugins);
        });
    }
    if(val == "guildCreate"){
        bot.on(val, (guild)=>{
            events.guildCreate.execute(bot, guild);
        });
    }
    if(val == "guildDelete"){
        bot.on(val, (guild)=>{
            events.guildDelete.execute(bot, guild);
        });
    }
}

function loadEvents(){
    return new Promise((resolve, reject)=>{
        fs.access('./src/events', fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if(err){
                console.log('Events folder does not exist!');
                process.exit(0);
            }else{
                fs.readdir("./src/events/", (err, files)=>{
                    if(err) reject("Could not read events folder!");
                    if(!files || files.length == 0){
                        reject("No files found in events folder!");
                    }else{
                        var js = 0;
                        var i = 0;
                        for(let val of files){
                            i++
                            if(val.endsWith(".js")){
                                js++
                                val = val.replace(/\.js$/, ""); // replace the value which ends .js with nothing
                                try{
                                    events[val] = require(`./src/events/${val}.js`);
                                    processEvent(val);
                                    if(files.length == i) resolve();
                                }catch(e){
                                    console.log(`Error loading ./src/events/${val}.js`, e);
                                    js--;
                                    if(files.length == i) resolve();
                                }
                            }
                        }
                    }
                });
            }
        });
    });
}

function loadPlugins(){
    return new Promise((resolve, reject)=>{
        fs.access('./src/plugins', fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if(err){
                return console.log('Plugins folder does not exist!');
            }else{
                fs.readdir("./src/plugins/", (err, files)=>{
                    if(err) reject("Could not read plugins folder!");
                    if(!files || files.length == 0){
                        console.log("No files found in plugins folder!");
                    }else{
                        var js = 0;
                        var i = 0;
                        for(let val of files){
                            i++
                            if(val.endsWith(".js")){
                                js++
                                val = val.replace(/\.js$/, ""); // replace the value which ends .js with nothing
                                try{
                                    plugins[val] = require(`./src/plugins/${val}.js`);
                                    if(files.length == i) resolve();
                                }catch(e){
                                    console.log(`Error loading ./src/plugins/${val}.js`, e);
                                    js--;
                                    if(files.length == i) resolve();
                                }
                            }
                        }
                    }
                });
            }
        });
    });
}

function loadCommands(){
    return new Promise((resolve, reject)=>{
        fs.access('./src/commands', fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if(err){
                console.log('Commands folder does not exist!');
                process.exit(0);
            }else{
                fs.readdir("./src/commands/", (err, files)=>{
                    if(err) reject("Could not read events file!");
                    if(!files || files.length == 0){
                        reject("No files found in commands folder!");
                    }else{
                        var js = 0;
                        var i = 0;
                        for(let val of files){
                            i++
                            if(val.endsWith(".js")){
                                js++
                                val = val.replace(/\.js$/, ""); // replace the value which ends .js with nothing
                                try{
                                    commands[val] = require(`./src/commands/${val}.js`);
                                    if(files.length == i) resolve();
                                }catch(e){
                                    console.log(`Error loading file ./src/commands/${val}.js`, e);
                                    js--;
                                    if(files.length == i) resolve();
                                }
                            }
                        }
                    }
                });
            }
        });
    });
}

function evaluate(msg, callback){
    var code = msg.content.substring(config.prefix.length + 4).trim();
    var result = "No Result!";
    try{
        result = eval(code);
    }catch(e){
        result = "Error: "+e;
    }
    if(result == "" || result == undefined || result == null) result = "undefined";
    callback(result);
}

function sendReady(){
    return new Promise(resolve => {
        console.log(`Ready to begin! Logged in as ${bot.user.username}#${bot.user.discriminator} and connected to ${bot.guilds.size} guilds!`);
        return resolve();
    });
}

function init(){
    return new Promise((resolve, reject)=>{
        loadEvents()
            .then(loadCommands())
            .then(loadPlugins())
            .then(sendReady())
            .catch(e => reject("Error during init: "+e));
    });
}

bot.on("ready", ()=>{
    init().catch(e => console.log(e));
});

bot.on("disconnected", ()=>{
    console.log("Disconnected from Discord!");
});

bot.on("error", (error)=>{
    console.log("Bot faced an error: "+error)
});

bot.connect();
