const { EmbedBuilder } = require('discord.js');
const { logsChannel, badwords, mutedRoleName, jailVCChannel } = require('../config.json');
const { logEx } = require('./Util.js');
const color = require('../colors.json');
module.exports = { messageFiltering };

async function messageFiltering(client) {
    client.on('messageCreate', async message => {
        const member = message.member;
        if((message.channelId === logsChannel) && !message.author.bot) {
            await message.delete(); 
            return;
        };

        if(message.author.bot) return;
        var content = message.content.toLowerCase();
        if(content == null) return;

        for(var i = 0; i < badwords.length; i++) {
            if(content.includes(badwords[i])) {
                await message.delete();
                try {
                    logEx(color.warning, '❗ Bad Words Deleted', `deleted message from <@${member.id}>\n**message**: \`\`${content}\`\``, message.guild, member);
                    const badwordsembed = new EmbedBuilder()
                        .setColor(color.warning)
                        .setTitle('❗ **bad words deleted**')
                        .setDescription(`\`${member.user.username}#${member.user.discriminator}\` said a bad word >:(`)
        
                    let warning = await message.channel.send({ embeds: [badwordsembed] });
                    setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
                } catch {
                    logEx(color.warning, '❗ Bad Words Deleted', `deleted message from \`\`unknown\`\`\n**message**: \`\`${content}\`\``, message.guild, member);
                    const badwordsembed = new EmbedBuilder()
                        .setColor(color.warning)
                        .setTitle('❗ **bad words deleted**')
                        .setDescription(`\`unknown\` said a bad word >:(`)
        
                    let warning = await message.channel.send({ embeds: [badwordsembed] });
                    setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
                };
            };
        };
    
        if(content.includes("discord.gg/") || content.includes("discordapp.com/invite/") || content.includes("discord.com/invite/")) {
            await message.delete();
            await member.roles.set([]);
            await member.roles.add(message.guild.roles.cache.find(role => role.name === mutedRoleName));
            if(member.voice.channel) await member.voice.setChannel(member.guild.channels.cache.get(jailVCChannel)); 

            const dmembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **you have been jailed on cozy community**')
                .setDescription(`**Reason:** [Automatic] posted an invite. \n\ndm a staff member to get unmuted.`)
                .setTimestamp()
                
            let dmenabled = true;
            await message.author.send({ embeds: [dmembed] }).catch(() => dmenabled = false);
            const inviteembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **invite link deleted**')
                .setDescription(`\`${member.user.username}#${member.user.discriminator}\` tried to post an invite link and got muted 🤡`)

            if(!dmenabled) {
                logEx(color.warning, '❗ Invite Link Deleted', `<@${member.id}> tried to post an invite link\n\n❗ unable to send DM due to users privacy settings`, message.guild, member);
            } else {
                logEx(color.warning, '❗ Invite Link Deleted', `<@${member.id}> tried to post an invite link`, message.guild, member);
            }
            let warning = await message.channel.send({ embeds: [inviteembed] });
            setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        };
    
        if(content.includes(":catvibe:")) {
            await message.reply("<a:catvibe:1035808779255676978>");
        };
    });
};