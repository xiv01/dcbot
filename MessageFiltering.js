const { EmbedBuilder } = require('discord.js');
const { logschannel, suggestionchannel, badwords } = require('./config.json');
const { logEx } = require('./Util.js');
const color = require('./colors.json');
module.exports = { messageFiltering };

async function messageFiltering(client) {
    client.on('messageCreate', async message => {
        if((message.channelId === logschannel) && !message.author.bot) {
            await message.delete(); 
            return;
        };
    
        if(message.author.bot) return;
        var content = message.content.toLowerCase();
        if(content == null) return;
    
        for(var i = 0; i < badwords.length; i++) {
            if(content.includes(badwords[i])) {
                await message.delete();
                logEx(color.warning, '❗ Bad Words Deleted', `deleted message from <@${message.member.id}>\n**message**: \`\`${content}\`\``, message.guild);
                const badwordsembed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **bad words deleted**')
                    .setDescription(`\`${message.member.user.username}#${message.member.user.discriminator}\` said a bad word >:(`)
    
                let warning = await message.channel.send({ embeds: [badwordsembed] });
                setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
            };
        };
    
        if(content.includes("discord.gg/" || "discordapp.com/invite/")) {
            if(message.member.permissionsIn(message.channel).has("ADMINISTRATOR")) return;
            await message.delete();
            message.guild.members.cache.get(message.author.id).roles.add(message.guild.roles.cache.find(role => role.name === 'muted'));

            const dmembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **you have been muted on cozy community**')
                .setDescription(`**Reason:** [Automatic] posted invite. \n\ndm a staff member to get unmuted.`)
                .setTimestamp()
                
            let dmenabled = true;
            await message.author.send({ embeds: [dmembed] }).catch(() => dmenabled = false);;   
            const inviteembed = new EmbedBuilder()
                .setColor(color.warning)
                .setTitle('❗ **invite link deleted**')
                .setDescription(`\`${message.member.user.username}#${message.member.user.discriminator}\` tried to post an invite link and got muted 🤡`)

            if(!dmenabled) {
                logEx(color.warning, '❗ Invite Link Deleted', `<@${message.member.id}> tried to post an invite link\n\n❗ unable to send DM due to users privacy settings`, message.guild);
            } else {
                logEx(color.warning, '❗ Invite Link Deleted', `<@${message.member.id}> tried to post an invite link`, message.guild);
            }
            let warning = await message.channel.send({ embeds: [inviteembed] });
            setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 8000);
        };
    
        if(content.includes(":catvibe:")) {
            await message.reply("<a:catvibe:1035808779255676978>");
        };
    
        if(message.channelId === suggestionchannel) {
            if(message.attachments.size > 0 || message.stickers.size > 0) {
                const warningembed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **your message cant contain attachments / stickers**')

                let toolong = await message.channel.send({ embeds: [warningembed]});
                setTimeout(() => toolong.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
                await message.delete();
                return;
            }
            if(message.type == 18) {
                await message.delete();
            } else {
                let content = message.content
                if(content.length > 87) {
                    const toolongembed = new EmbedBuilder()
                        .setColor(color.warning)
                        .setTitle('❗ **your message was too long**')

                    let toolong = await message.channel.send({ embeds: [toolongembed]});
                    await message.delete();
                    setTimeout(() => toolong.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
                } else {
                    logEx(color.defaultLog, 'Poll Posted', `<@${message.member.id}> posted a pool\n**message**: ${content}`, message.guild);
                    const suggestembed = new EmbedBuilder()
                        .setColor(color.pink)
                        .setTitle(`${content}`)
                        .setAuthor({
                            name: `${message.member.displayName}`,
                            iconURL: `${message.member.displayAvatarURL()}`,
                    })
                    
                    await message.channel.send({embeds: [suggestembed]}).then(function (message) {
                        message.react('✅');
                        message.react('❌');
                        message.startThread({
                            name: `discussion - ${content}`,
                            type: 'GUILD_PUBLIC_THREAD'
                        });
                    });
                    message.delete(message.id);
                };
            };
        };
    });
};