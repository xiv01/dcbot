const { logEx } = require('./Util.js');
const { badwords, delmessageblacklist, voicelogschannel } = require('./config.json');
const color = require('./colors.json');
module.exports = { advancedLogging };

async function advancedLogging(client) {
    client.on('channelCreate', async channel => {
        logEx(color.defaultLog, 'New Channel Created', `**name**: \`\`${channel.name}\`\``, channel.guild);
    });
    client.on('channelDelete', async channel => {
        logEx(color.defaultLog, 'Channel Deleted', `**name**: \`\`${channel.name}\`\``, channel.guild);
    });
    client.on('guildBanAdd', async ban => {
        logEx(color.defaultLog, 'Member Banned', `\`\`${ban.user.username}#${ban.user.discriminator}\`\` has been banned`, ban.guild, ban.member);
    });
    client.on('guildBanRemove', async ban => {
        logEx(color.defaultLog, 'Member Unbanned', `\`\`${ban.user.username}#${ban.user.discriminator}\`\` has been unbanned`, ban.guild, ban.member);
    });
    client.on('roleCreate', async role => {
        logEx(color.defaultLog, 'Role Created', `**name**: \`\`${role.name}\`\``, role.guild);
    });
    client.on('roleDeleted', async role => {
        logEx(color.defaultLog, 'Role Deleted', `**name**: \`\`${role.name}\`\``, role.guild);
    });
    client.on('voiceStateUpdate', (oldState, newState) => {
        if(newState.channel === oldState.channel) return;
        if (newState.channel) { 
            logEx(color.joinLog, '🔊 VC Join', `**member**: <@${newState.member.id}>\n **channel**: <#${newState.channel.id}>`, newState.channel.guild, newState.member, voicelogschannel);
        } else if (oldState.channel) { 
            logEx(color.leaveLog, '🔇 VC Leave', `**member**: <@${newState.member.id}>\n **channel**: <#${oldState.channel.id}>`, oldState.channel.guild, oldState.member, voicelogschannel);
        };
    });
    client.on('messageDelete', async message => {
        try {
            if(message.content.includes("discord.gg/" || "discordapp.com/invite/")) return;
            if(message.author.bot === null || message.author.bot) return;
            for(var i = 0; i < delmessageblacklist.length; i++) if(message.channel.id === delmessageblacklist[i]) return;
            var content = message.content.toLowerCase();
            for(var i = 0; i < badwords.length; i++) if(content.includes(badwords[i])) return;

            let contentstring =  `**author**: <@${message.author.id}>\n **channel**: <#${message.channel.id}>`;
            if(message.content.length > 0) contentstring += `\n **message**: ${message.content}`;
            if(message.stickers.size > 0) contentstring += `\n **sticker**: ${message.stickers.first().name}`;
            if(message.attachments.size > 0) {
                let string = '';
                message.attachments.forEach(urls => {
                    string += urls.url + '\n';

                });
                contentstring += `\n **attachments**: ${string}`;
            };
            logEx(color.warning, '🗑️ Deleted Message', contentstring, message.guild, message.member);
        } catch {
            logEx(color.warning, '❗Failed to log Deleted Message', `**channel**: <#${message.channel.id}>`, message.guild, message.member);
        };
    });
};