const Canvas = require("canvas");
const { registerFont } = require('canvas');
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Collection, EmbedBuilder, Routes } = require('discord.js');
const { clientId, guildId, token, logschannel } = require('./config.json');
const color = require('./colors.json');
module.exports = { logEx, drawWelcomeImage, getUnixTime, registerCommands };

async function logEx(color, title, message, guild) {
    let date = new Date();
    console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${message.replace(/[*`\n]/g, "")}`);
    if(guild != undefined) {
        let logembed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(message)
            .setTimestamp()
        await guild.channels.cache.get(logschannel).send({ embeds: [logembed] });
    }
};

function getUnixTime() {
    return Math.floor(new Date().getTime() / 1000);
};

function registerCommands(guild, client) {
    client.commands = new Collection();
    const commandsI = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
    	const filePath = path.join(commandsPath, file);
    	const command = require(filePath);
    	commandsI.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    };

    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsI })
    	.then(() => logEx(color.defaultLog, '⚙️ System', 'successfully registered commands', guild))
    	.catch(console.error);
};

async function drawWelcomeImage(member, guild) {
    const canvas = Canvas.createCanvas(400, 165);

    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(`./resources/images/welcomeImage.png`);
    registerFont('./resources/fonts/base.ttf', { family: 'custom' });
    registerFont('./resources/fonts/math.ttf', { family: 'custom' });
    registerFont('./resources/fonts/symbols.ttf', { family: 'custom' });
    registerFont('./resources/fonts/extended.ttf', { family: 'custom' });

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (member === 'testrender') {
        var username = 'test render';
        var avatar = await Canvas.loadImage(`./resources/images/welcomeImage.png`);
        logEx(color.defaultLog, '⚙️ System', 'performing test render', guild);
    } else {
        var username = `${member.user.username}`;
        var avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
    };

    if(username.length > 22) {
        ctx.font = `18px "custom"`;
    } else {
        ctx.font = `25px "custom"`;
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(username, canvas.width / 2, canvas.height / 2 + 67);

    ctx.beginPath();
    ctx.arc(200, canvas.height / 2 - 23, 55, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.fill()

    ctx.beginPath();
    ctx.arc(200, canvas.height / 2 - 23, 49, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 150, 10, 100, 100);

    return canvas.toBuffer();
};