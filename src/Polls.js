const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { suggestionChannel } = require('../config.json');
const { logEx } = require('./Util.js');
const color = require('../colors.json');
module.exports = { polls };

async function polls(client) { 
    client.on('messageCreate', async message => {
        if(message.author.bot) return;
        var content = message.content.toLowerCase();
        if(content == null) return;

        if(message.channelId === suggestionChannel) {
            if(message.attachments.size > 0 || message.stickers.size > 0) {
                await message.delete();
                const warningEmbed = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle('❗ **your message cant contain attachments / stickers**')
                let warning = await message.channel.send({ embeds: [warningEmbed]});
                setTimeout(() => warning.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
                return;
            }
            if(message.type == 18) {
                await message.delete();
            } else {
                let content = message.content
                if(content.length > 87) {
                    const tooLongEmbed = new EmbedBuilder()
                        .setColor(color.warning)
                        .setTitle('❗ **your message was too long**')
                    let tooLong = await message.channel.send({ embeds: [tooLongEmbed]});
                    await message.delete();
                    setTimeout(() => tooLong.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 5000);
                } else {
                    try { 
                        await message.delete();
                    } catch {
                        return;
                    };
                    var confirm = new ButtonBuilder()
                        .setCustomId('pollConfirm')
                        .setLabel('confirm')
                        .setStyle(3);
                
                    var cancel = new ButtonBuilder()
                        .setCustomId('pollCancel')
                        .setLabel('cancel')
                        .setStyle(4);

                    var confirmEmbed = new EmbedBuilder()
                        .setColor(color.pink)
                        .setTitle('confirming this action will create a new poll called \`' + content + '\` are you sure you want to do that ?')
                        .setFooter({ text: message.author.username, iconURL: message.member.displayAvatarURL()});

                    var cancelledEmbed = new EmbedBuilder()
                        .setColor(color.pink)
                        .setTitle('cancelling ...');

                    let confirmMessage = await message.channel.send({ embeds: [confirmEmbed], components: [new ActionRowBuilder().addComponents(confirm, cancel)] });
                    const collector = confirmMessage.createMessageComponentCollector({ componentType: 2, time: 20_000 });
                    collector.on('collect', async i => {
                        if(i.user.id !== message.author.id) {
                            const noPermissionEmbed = new EmbedBuilder()
                                .setColor(color.warning)
                                .setTitle('❗No Permission')
                                .setDescription(`only **${message.author.username}** can control this menu`)
                            i.reply({ embeds: [noPermissionEmbed], ephemeral: true });
                            return;
                        };
                        if (i.customId === 'pollConfirm') {
                            await confirmMessage.delete();
                            logEx(color.defaultLog, 'Poll Posted', `<@${message.member.id}> posted a poll\n**message**: ${content}`, message.guild, message.member);
                            const suggestEmbed = new EmbedBuilder()
                                .setColor(color.pink)
                                .setTitle(`${content}`)
                                .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL(),
                            });
                            await message.channel.send({ embeds: [suggestEmbed], components: [] }).then(function (message) {
                                message.react('✅');
                                message.react('❌');
                                message.startThread({
                                    name: `discussion - ${content}`,
                                    type: 'GUILD_PUBLIC_THREAD'
                                });
                            });
                        } else if (i.customId === 'pollCancel') {
                    		await confirmMessage.edit({ embeds: [cancelledEmbed], components: [] });
                            setTimeout(() => confirmMessage.delete().catch(() => { console.error("[error] unable to delete message (already deleted?)") }), 1200)
                        };
                    });
                    collector.on('end', async() => {
                        try {
                            await confirmMessage.delete();
                        } catch { return };
                    });
                };
            };
        };
    });
};