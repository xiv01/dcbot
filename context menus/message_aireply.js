const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { generateAIResponse, sendReply } = require('../src/ChatAI.js');
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
        let reply = await generateAIResponse(client, message, message.content)
        sendReply(reply, message)
    },
};