const Canvas = require("canvas");
const { registerFont } = require('canvas');
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Collection, EmbedBuilder, Routes } = require('discord.js');
const { clientId, guildId, token, logsChannel } = require('../config.json');
const color = require('../colors.json');
module.exports = { logEx, drawWelcomeImage, getUnixTime, registerCommands };

async function logEx(color, title, message, guild, member, channel) {
    let date = new Date();
    let logmessage = message.replace(/[*`\n]/g, '');
    if(typeof channel === 'undefined') channel = logsChannel;
    if(typeof guild != 'undefined') {
        if(typeof member != 'undefined') {
                const logembed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(title)
                    .setDescription(message)
                    .setFooter({ text: `${member.user.username}`, iconURL: member.displayAvatarURL() })
                    .setTimestamp()
                await guild.channels.cache.get(channel).send({ embeds: [logembed] });
            } else {
                const logembed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(title)
                    .setDescription(message)
                    .setTimestamp()
                await guild.channels.cache.get(logsChannel).send({ embeds: [logembed] });
            };
        console.log(`[${[date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })]}] ${title + " " + logmessage}`);
    }
};

function getUnixTime() {
    return Math.floor(new Date().getTime() / 1000);
};

function registerCommands(guild, client) {
    const rest = new REST({ version: '10' }).setToken(token);
    client.commands = new Collection();
    client.contextmenus = new Collection();
    const reqBody = [];
    const slashCommandsPath = path.join(__dirname,'../commands');
    const contextMenuCommandsPath = path.join(__dirname,'../context menus');
    const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));
    const contextMenuCommandFiles = fs.readdirSync(contextMenuCommandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of slashCommandFiles) {
    	const filePath = path.join(slashCommandsPath, file);
    	const command = require(filePath);
    	reqBody.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    };
    for (const file of contextMenuCommandFiles) {
    	const filePath = path.join(contextMenuCommandsPath, file);
    	const command = require(filePath);
    	reqBody.push(command.data.toJSON());
        client.contextmenus.set(command.data.name, command);
    };

    rest.put(Routes.applicationCommands(clientId), { body: reqBody })
    	.then(() => logEx(color.defaultLog, '⚙️ System', 'successfully registered commands', guild))
    	.catch(console.error);
};

async function drawWelcomeImage(member, guild) {
    const canvas = Canvas.createCanvas(400, 165);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(`./resources/images/welcomeImage.png`);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (member === 'testrender') {
        fs.readdir('./resources/fonts', (err, files) => {
            let fonts = 0;
            files.forEach(font => {
                registerFont('./resources/fonts/' + font, { family: 'custom' });
                fonts++;
            });
            logEx(color.defaultLog, '⚙️ System', `performing test render \nregistered \`${fonts}\` fonts`, guild);
        });
        var username = 'test render';
        var avatar = await Canvas.loadImage(`./resources/images/welcomeImage.png`);
    } else {
        var username = member.user.username;
        var avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
    };

    if(username.length > 20) {
        ctx.font = `18px "custom"`;
    } else {
        ctx.font = `25px "custom"`;
    };
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(username, canvas.width / 2, canvas.height / 2 + 67);

    ctx.beginPath();
    ctx.arc(200, canvas.height / 2 - 23, 55, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(200, canvas.height / 2 - 23, 49, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 150, 10, 100, 100);

    return canvas.toBuffer();
};
