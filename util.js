const Canvas = require("canvas");
const { registerFont } = require('canvas');
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token, logschannel } = require('./config.json');
module.exports = { logEx, drawWelcomeImage, newColor, getUnixTime, registerCommands };

async function logEx(message, guild) {
    let date = new Date();
    console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${message}`);
    if(guild != undefined) {
        await guild.channels.cache.get(logschannel).send(`\`\`\`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${message}\`\`\``);
    }
}

function getUnixTime() {
    return Math.floor(new Date().getTime() / 1000);
}

function registerCommands(guild) {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
    	const filePath = path.join(commandsPath, file);
    	const command = require(filePath);
    	commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    	.then(() => logEx('successfully registered commands', guild))
    	.catch(console.error);
}

async function newColor(userID, roles, guild) {
    await guild.members.fetch(userID).then(async member => {
        var highest = member.roles.highest
        if(highest.name != "rainbow") {
            await member.roles.add(roles[Math.floor(Math.random() * roles.length)]); 
            return;
        }
        currentrole = roles[Math.floor(Math.random() * roles.length)];
        while(currentrole === member.roles.highest) {
            currentrole = roles[Math.floor(Math.random() * roles.length)];
        }
        await member.roles.add(currentrole);
        if(highest.name != "rainbow") { // kys 
            return;
        }
        await member.roles.remove(highest);
    }).catch(console.error)
}

async function drawWelcomeImage(member, guild) {
    const canvas = Canvas.createCanvas(400, 165);

    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(`./images/resources/welcomeImage.png`);
    registerFont('ARLRDBD.TTF', { family: 'ArialR' })

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (member === 'testrender') {
        var username = 'test render';
        var membercount = 'test render';
        var avatar = await Canvas.loadImage(`./images/resources/welcomeImage.png`);
        logEx('performing test render', guild)
    } else {
        var username = `${member.user.username}#${member.user.discriminator}`;
        var membercount = member.guild.memberCount
        var avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
    }

    ctx.fillStyle = '#f2f2f2';
    if(/[^\u0000-\u00ff]/.test(username)) {
        ctx.font = `19px "ArialR"`;
        username = "welcome to the server <3";
        ctx.fillText(username, canvas.width / 2 - 45, canvas.height / 2 + 25);
    } else {
        var size = 27;
        var offset = 45;
        for(var i = username.length - 1; i > 0; i--) {
            if(size > 12) {
                size = size - 0.45;
            }
            if(offset > -45) {
                offset = offset - 5;
            }
        }
        ctx.font = `${size}px "ArialR"`;
        ctx.fillText(username, canvas.width / 2 + offset, canvas.height / 2 + 25);
    }

    var string = `you are member #${membercount}`;
    ctx.fillStyle = '#8155fa';
    ctx.font = '20px "ArialR"';
    if(membercount > 100 && membercount < 1000) {
        ctx.fillText(string, canvas.width / 2 - 40, canvas.height / 2 + 60);
    } else if(membercount > 1000) {
        ctx.fillText(string, canvas.width / 2 - 45, canvas.height / 2 + 60);
    } else {
        ctx.fillText(string, canvas.width / 2 - 30, canvas.height / 2 + 60);
    }

    ctx.beginPath();
    ctx.arc(74.5, canvas.height / 2 - 3, 57, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 12, 15, 125, 125);

    return canvas.toBuffer();
}