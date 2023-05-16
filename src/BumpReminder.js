const fs = require('node:fs');
const { EmbedBuilder } = require('discord.js');
const { bumperRoleName, bumpChannel, guildId, lastbump } = require('../config.json');
const { logEx, getUnixTime } = require('./Util.js');
const color = require('../colors.json');
module.exports = { bumpReminder };

async function bumpReminder(guild, client) {
    const bumperRole = guild.roles.cache.find(role => role.name === bumperRoleName);
    const commands = await client.application.commands.fetch();
    const command = commands.find(cmd => cmd.name === 'bumper');

    const reminderEmbed = new EmbedBuilder()
        .setColor(color.pink)
        .setTitle(`🔔 Bump Reminder`)
        .setDescription(`use </bumper:${command.id}> to give urself the bumper role and receive bump notifications`)

    logEx(color.bumpLog, '🔔 Bump Reminder', `last bump was \`${getUnixTime() - lastbump}\` seconds ago`, guild);
    if((lastbump + 7200) < getUnixTime()) {
        guild.channels.cache.get(bumpChannel).send({ content: `${bumperRole}`, embeds: [reminderEmbed] });
        logEx(color.bumpLog, '🔔 Bump Reminder', `sending bump reminder message`, guild);
        await guild.channels.cache.get(bumpChannel).setTopic(`next bump: <t:${getUnixTime() + 7200}:R>`)
    } else {
        logEx(color.bumpLog, '🔔 Bump Reminder', `starting bump remind timer\n**time left**: \`${Math.round(((lastbump + 7200 - getUnixTime()) / 60) * 100) / 100}\` minutes`, guild);
        setTimeout(() => { 
            guild.channels.cache.get(bumpChannel).send({ content: `${bumperRole}`, embeds: [reminderEmbed] });
            bumped = false;
        }, ((lastbump + 7200) - getUnixTime()) * 1000);
    };

    client.on('messageCreate', async message => {
        if(message.channelId === bumpChannel) {
            if(message.embeds.length > 0) {
                if(message.embeds[0].description != null) {
                    if((message.embeds[0].description.includes("Bump erfolgreich!") || message.embeds[0].description.includes("Bump done!"))) {
                        logEx(color.bumpLog, '🔔 Bump Reminder', `server bumped\n**timestamp**: \`${getUnixTime()}\``, message.guild);
                        let config = JSON.parse(fs.readFileSync(__dirname + '/../config.json', 'utf8'));
                        config.lastbump = getUnixTime();
                        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
                        await message.channel.setTopic(`next bump: <t:${getUnixTime() + 7200}:R>`)
                        const bumperRole = message.guild.roles.cache.find(role => role.name === bumperRoleName);
                        setTimeout(() => { 
                            message.channel.send({ content: `${bumperRole}`, embeds: [reminderEmbed] });
                        }, 7200000);
                    };
                };
            };
        };
    });
};