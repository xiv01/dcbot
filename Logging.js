const { logEx } = require('./Util.js');
const { badwords, delmessageblacklist, voicelogschannel, memberlogschannel, guildId } = require('./config.json');
const color = require('./colors.json');
module.exports = { advancedLogging };

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function advancedLogging(client) {
    var lastMsgDel = null;
    client.on('guildAuditLogEntryCreate', async (entry, guild) => {
        if(entry.action === 72) lastMsgDel = entry;
        if(entry.action === 22) {
            let executor = await guild.members.fetch(entry.executorId); 
            logEx(color.warning, '🔨 Member Banned', `<@${entry.executorId}> \`\`${executor.user.tag}\`\` banned <@${entry.targetId}>\`\`${entry.target.tag}\`\``, guild, await guild.members.fetch(entry.executorId), memberlogschannel);
        };
        if(entry.action === 23) {
            let executor = await guild.members.fetch(entry.executorId); 
            logEx(color.success, 'Member Unbanned', `<@${entry.executorId}> \`\`${executor.user.tag}\`\` unbanned <@${entry.targetId}>\`\`${entry.target.tag}\`\``, guild, await guild.members.fetch(entry.executorId), memberlogschannel);
        };
        if(entry.action === 20) {
            let executor = await guild.members.fetch(entry.executorId); 
            logEx(color.warning, '💥 Member Kicked', `<@${entry.executorId}> \`\`${executor.user.tag}\`\` kicked <@${entry.targetId}>\`\`${entry.target.tag}\`\``, guild, await guild.members.fetch(entry.executorId), memberlogschannel);
        };
    });
    client.on('channelCreate', async channel => {
        logEx(color.defaultLog, 'New Channel Created', `**name**: \`\`${channel.name}\`\``, channel.guild);
    });
    client.on('channelDelete', async channel => {
        logEx(color.defaultLog, 'Channel Deleted', `**name**: \`\`${channel.name}\`\``, channel.guild);
    });
    client.on('roleCreate', async role => {
        logEx(color.defaultLog, 'Role Created', `**name**: \`\`${role.name}\`\``, role.guild);
    });
    client.on('roleDeleted', async role => {
        logEx(color.defaultLog, 'Role Deleted', `**name**: \`\`${role.name}\`\``, role.guild);
    });
    client.on('voiceStateUpdate', async (oldState, newState) => {
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

            await delay(1000)
            let contentstring =  `**author**: <@${message.author.id}>\n **channel**: <#${message.channel.id}>`;
            if(lastMsgDel !== null) {
                if(message.author.id === lastMsgDel.targetId) {
                    contentstring += `\n **deleted by**:  <@${lastMsgDel.executorId}>`;
                    lastMsgDel = null;
                };
            };
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
    client.rest.on('rateLimited', async data => {
        const guild = client.guilds.cache.get(guildId);
        logEx(color.warning, '❗ Bot Rate Limited', `**TTR**: \`\`${data.timeToReset}\`\` \n**limit**: \`\`${data.limit}\`\` \n**method**: ${data.method} \n**url**: ${data.url} \n**route**: \`\`${data.route}\`\` \n**global**: ${data.global}`, guild);
    });
};