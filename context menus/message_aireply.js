const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder} = require('discord.js');
const { generateAIResponse } = require('../src/ChatAI.js');
const color = require('../colors.json');

const errorEmbed = new EmbedBuilder()
    .setColor(color.warning)
    .setTitle(`**❗ cant reply to this message**`)

const successEmbed = new EmbedBuilder()
    .setColor(color.success)
    .setTitle(`**✅ replying to this message**`)

module.exports = {
    data: new ContextMenuCommandBuilder()
    	.setName('AI reply')
    	.setType(ApplicationCommandType.Message),
    async execute(interaction, client) {
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        if(message.author.bot || message.content === null || typeof message === 'undefined') {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        };
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        let reply = await generateAIResponse(client, message, interaction.member.displayName + ' wants you to reply to a message by ' + message.member.displayName + ': ' + message.content)
        if(reply.length > 2000) {
            try {
                await message.reply(reply.substr(0, 2000));
            } catch {
                await message.channel.send(reply.substr(0, 2000));
            };
            for(i = 1; i < reply.length / 2000; i++) {
                await message.channel.send(reply.substr(i * 2000, 2000 + (i * 2000)));
            };
        } else {
            try {
                await message.reply(reply);
            } catch {
                await message.channel.send(reply);
            };
        };
    },
};